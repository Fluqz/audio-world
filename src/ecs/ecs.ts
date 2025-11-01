import { Component, ComponentClass, ComponentStore} from "./components/component";
import { Entity } from "./entity";
import { System } from "./systems/system";
import { ScriptComponent } from "./components/script-component";
import { TagComponent } from "./components/tag-component";
import { NameComponent } from "./components/name-component";
import { EventBus } from "./event-bus";

export class ECS {
    
    /** ID counter that is used to make Entity IDs. */
    private nextEntityId: Entity = 0
    /** All entities that were created. */
    public entities: Set<Entity> = new Set()
    /** A map of ComponentStores for each Component Type. */
    public componentStores: Map<Function, ComponentStore<any>> = new Map()
    /** Array of registered systems */
    public systems: System[] = []

    /** The event bus for the ECS. */
    private eventBus = new EventBus();

    // Optional: expose it to systems
    public get events() {
        return this.eventBus;
    }
    
    /** Creates a entity. No event bus! */
    private createEntity(): Entity {

        const entity = this.nextEntityId++
        this.entities.add(entity)

        return entity
    }

    createEntityWithComponents(components: Component[]): Entity {

        const entity = this.createEntity()

        for (const comp of components) {

            this.addComponent(entity, comp)
        }

        this.events.emit('entity-added', entity)

        return entity
    }

    // loadPrefabFile(path:string) {
        
    //     const jsonString = null

    //     return jsonString
    // }

    // createFromPrefab(prefab: Prefab) {

    //     const entity = this.createEntity()

    //     if(prefab.name) this.addName(entity, prefab.name)

    //     if(prefab.components) {

    //         for(let comp of prefab.components) {

    //             console.log('comp', comp)
    //         }
    //     }
    // }

    /** Destroys the entity and all its components. */
    destroyEntity(entity: Entity): void {

        if (!this.entities.has(entity)) return;

        // Handle script cleanup if applicable
        const scriptComponent = this.getComponent(entity, ScriptComponent);
        if (scriptComponent) {
            for (const script of scriptComponent.scripts) {
                script.destroy?.(entity, this);
            }
        }
        
        for (const [ComponentClass, store] of this.componentStores.entries()) {
            const comp = store.get(entity) as Component
            if (comp && comp.destroy != undefined) {
                comp.destroy()
            }
            store.remove(entity)
        }

        this.entities.delete(entity);

        this.eventBus.emit('entity-removed', { entity })
    }

    /** Check if entity is part of the ECS. */
    entityExists(entity: Entity): boolean {
        return this.entities.has(entity);
    }

    /** Add a component to an entity. Makes a new ComponentStore if not existant. */
    addComponent<T extends Component>(entity: Entity, component: T): void {
        const type = component.constructor as ComponentClass<T>;
        if (!this.componentStores.has(type)) {
            this.componentStores.set(type, new ComponentStore<T>());
        }
        this.componentStores.get(type)!.add(entity, component);

        this.eventBus.emit('component-added', { entity, component })
    }

    /** Returns the component of an entity by component class name. */
    getComponent<T extends Component>(entity: Entity, componentClass: ComponentClass<T>): T | undefined {
        return this.componentStores.get(componentClass)?.get(entity);
    }

    /** Returns all components of an entity */
    getAllComponents(entity: Entity) : Component[] {

        const components: Component[] = []
        for(let [componentClass, store] of this.componentStores.entries()) {

            const comp: Component = store.get(entity)

            if(comp) components.push(comp)
        }

        return components
    }

    /** Returns all entities. */
    getAllEntities() {

        return this.entities
    }

    /** Removes a component */
    removeComponent<T extends Component>(entity: Entity, componentClass: ComponentClass<T>): void {

        const store = this.componentStores.get(componentClass)

        if(!store) return

        const component = store.get(entity)

        if(component && component.destroy) component.destroy()

        this.eventBus.emit('component-removed', { entity, component })
    }

    registerSystem(system: System): void {

        this.systems.push(system)

        system.init(this)

        this.eventBus.emit('system-registered', { system })
    }

    unregisterSystem(system: System): void {

        this.systems.splice(this.systems.indexOf(system), 1)

        this.eventBus.emit('system-unregistered', { system })
    }

    update(dt: number): void {

        for (const system of this.systems) {

            system.update(this, dt);
        }
    }
    /** Queries all entities with the passed in components. Will not go down the child parent hierarchy. */
    *queryEntities<T extends Component[]>(...componentClasses: { [K in keyof T]: ComponentClass<T[K]> }): Iterable<[Entity, T]> {
        
        if (componentClasses.length === 0) return;

        const primaryStore = this.componentStores.get(componentClasses[0]);
        if (!primaryStore) return;

        const [entities] = primaryStore.getAll();

        for (const entity of entities) {
            const components = [] as unknown as T;
            let include = true;

            for (let i = 0; i < componentClasses.length; i++) {
                const cls = componentClasses[i];
                const store = this.componentStores.get(cls);
                if (!store || !store.has(entity)) {
                    include = false;
                    break;
                }
                components[i] = store.get(entity)!;
            }

            if (include) {
                yield [entity, components];
            }
        }
    }

    /** Queries all entities with the past in components. 
     * This function will also include child components when quering a parent component! 
     * */
    *queryEntitiesExtended<T extends Component[]>(...componentClasses: { [K in keyof T]: ComponentClass<T[K]> }): Iterable<[Entity, T]> {
        if (componentClasses.length === 0) return;

        // Step 1: Build the list of component classes, including the parent classes.
        const allComponentClasses: Set<ComponentClass<Component>> = new Set();

        for (const componentClass of componentClasses) {
            let currentClass: ComponentClass<Component> | null = componentClass;

            // Traverse the prototype chain to include parent classes
            while (currentClass) {
                allComponentClasses.add(currentClass);
                currentClass = Object.getPrototypeOf(currentClass.prototype)?.constructor ?? null;
            }
        }

        // Step 2: Find the primary store for the first component class
        const primaryStore = this.componentStores.get(componentClasses[0]);
        if (!primaryStore) return;

        const [entities] = primaryStore.getAll();

        // Step 3: Query the entities and their components
        for (const entity of entities) {
            const components = [] as unknown as T;
            let include = true;

            // Check for each class in the query (including parent classes)
            for (let i = 0; i < componentClasses.length; i++) {
                const cls = componentClasses[i];
                const store = this.componentStores.get(cls);

                // If the entity doesn't have the component, skip it
                if (!store || !store.has(entity)) {
                    include = false;
                    break;
                }
                components[i] = store.get(entity)!;
            }

            // If the entity has all requested components, yield it
            if (include) {
                // Step 4: Collect child components for the entity
                const childComponents: any[] = [];
                allComponentClasses.forEach(cls => {
                    const store = this.componentStores.get(cls);
                    if (store?.has(entity)) {
                        childComponents.push(store.get(entity));
                    }
                });

                // Combine the original components with child components
                yield [entity, [...components, ...childComponents] as T];
            }
        }
    }

    hasTag(entity: Entity, tagName: string): boolean {
        
        const tag = this.getComponent(entity, TagComponent)
        return tag?.tagName === tagName
    }

    *queryTagged<T extends Component[]>(tagName: string,...componentClasses: { [K in keyof T]: ComponentClass<T[K]> }): Iterable<[Entity, T]> {

                            
        const tagStore: ComponentStore<TagComponent> = this.componentStores.get(TagComponent);
        if (!tagStore) return;

        const [entities] = tagStore.getAll();

        for (const entity of entities) {

            const tag = tagStore.get(entity);

            if (!tag || tag.tagName !== tagName) continue;

            // If no components requested, just return the entity
            if (componentClasses.length === 0) {
                yield [entity, [] as unknown as T];
                continue;
            }

            const components = [] as unknown as T;
            let match = true;

            for (let i = 0; i < componentClasses.length; i++) {
                const cls = componentClasses[i];
                const store = this.componentStores.get(cls);
                if (!store || !store.has(entity)) {
                    match = false;
                    break;
                }
                components[i] = store.get(entity)!;
            }

            if (match) {
                yield [entity, components];
            }
        }
    }

    getTaggedEntity<T extends Component[]>(tagName: string, ...componentClasses: { [K in keyof T]: ComponentClass<T[K]> }): [Entity, T] | undefined {

        const iterator = this.queryTagged(tagName, ...componentClasses)[Symbol.iterator]()
        const result = iterator.next()
        return result.done ? undefined : result.value
    }

}
