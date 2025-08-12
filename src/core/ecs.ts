import { ComponentStore } from "./components/component";
import { Component, ComponentClass } from "./components/component";
import { ScriptComponent } from "./components/script-component";
import { TagComponent } from "./components/tag-component";
import { Entity } from "./entity";
import { System } from "./systems/system";

export class ECS {

    private nextEntityId: Entity = 0;
    private entities: Set<Entity> = new Set();
    private componentStores: Map<Function, ComponentStore<any>> = new Map();
    private systems: System[] = [];

    createEntity(): Entity {
        const id = this.nextEntityId++;
        this.entities.add(id);
        return id;
    }

    destroyEntity(entity: Entity): void {

        if (!this.entities.has(entity)) return;

        // Handle script cleanup if applicable
        const scriptComponent = this.getComponent(entity, ScriptComponent);
        if (scriptComponent) {
            for (const script of scriptComponent.scripts) {
                script.destroy?.(entity, this);
            }
        }
        
        for (const [type, store] of this.componentStores.entries()) {
            const comp = store.get(entity);
            if (comp && typeof comp.onDestroy === "function") {
                comp.destroy(entity, this);
            }
            store.remove(entity);
        }

        this.entities.delete(entity);
    }

    addComponent<T extends Component>(entity: Entity, component: T): void {
        const type = component.constructor as ComponentClass<T>;
        if (!this.componentStores.has(type)) {
            this.componentStores.set(type, new ComponentStore<T>());
        }
        this.componentStores.get(type)!.add(entity, component);
    }

    getComponent<T extends Component>(entity: Entity, componentClass: ComponentClass<T>): T | undefined {
        return this.componentStores.get(componentClass)?.get(entity);
    }

    removeComponent<T extends Component>(entity: Entity, componentClass: ComponentClass<T>): void {
        this.componentStores.get(componentClass)?.remove(entity);
    }

    registerSystem(system: System): void {
        this.systems.push(system)
    }

    unregisterSystem(system: System): void {
        this.systems.splice(this.systems.indexOf(system), 1)
    }

    update(dt: number): void {

        for (const system of this.systems) {

            system.update(this, dt);
        }
    }
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

    addTag(entity: Entity, tagName: string): void {

        this.addComponent(entity, new TagComponent(tagName))
    }

    hasTag(entity: Entity, tagName: string): boolean {
        
        const tag = this.getComponent(entity, TagComponent)
        return tag?.tagName === tagName
    }

    *queryTagged<T extends Component[]>(
                            tagName: string,
                            ...componentClasses: { [K in keyof T]: ComponentClass<T[K]> }
                        ): Iterable<[Entity, T]> {

                            
        const tagStore = this.componentStores.get(TagComponent);
        if (!tagStore) return;

        console.log('tagStores', tagStore)

        const [entities] = tagStore.getAll();

        for (const entity of entities) {

            const tag = tagStore.get(entity);

            if (!tag || tag.tag !== tagName) continue;

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
    getTaggedEntity<T extends Component[]>(
                        tagName: string,
                        ...componentClasses: { [K in keyof T]: ComponentClass<T[K]> }
                    ): [Entity, T] | undefined {

        const iterator = this.queryTagged(tagName, ...componentClasses)[Symbol.iterator]()
        const result = iterator.next()
        return result.done ? undefined : result.value
    }

}
