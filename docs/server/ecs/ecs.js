"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECS = void 0;
const component_1 = require("./components/component");
const script_component_1 = require("./components/script-component");
const tag_component_1 = require("./components/tag-component");
const event_bus_1 = require("./event-bus");
class ECS {
    constructor() {
        /** ID counter that is used to make Entity IDs. */
        this.nextEntityId = 0;
        /** All entities that were created. */
        this.entities = new Set();
        /** A map of ComponentStores for each Component Type. */
        this.componentStores = new Map();
        /** Array of registered systems */
        this.systems = [];
        /** The event bus for the ECS. */
        this.eventBus = new event_bus_1.EventBus();
    }
    // Optional: expose it to systems
    get events() {
        return this.eventBus;
    }
    /** Creates a entity. No event bus! */
    createEntity() {
        const entity = this.nextEntityId++;
        this.entities.add(entity);
        return entity;
    }
    createEntityWithComponents(components) {
        const entity = this.createEntity();
        for (const comp of components) {
            this.addComponent(entity, comp);
        }
        this.events.emit('entity-added', entity);
        return entity;
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
    destroyEntity(entity) {
        var _a;
        if (!this.entities.has(entity))
            return;
        // Handle script cleanup if applicable
        const scriptComponent = this.getComponent(entity, script_component_1.ScriptComponent);
        if (scriptComponent) {
            for (const script of scriptComponent.scripts) {
                (_a = script.destroy) === null || _a === void 0 ? void 0 : _a.call(script, entity, this);
            }
        }
        for (const [ComponentClass, store] of this.componentStores.entries()) {
            const comp = store.get(entity);
            if (comp && comp.destroy != undefined) {
                comp.destroy();
            }
            store.remove(entity);
        }
        this.entities.delete(entity);
        this.eventBus.emit('entity-removed', { entity });
    }
    /** Check if entity is part of the ECS. */
    entityExists(entity) {
        return this.entities.has(entity);
    }
    /** Add a component to an entity. Makes a new ComponentStore if not existant. */
    addComponent(entity, component) {
        const type = component.constructor;
        if (!this.componentStores.has(type)) {
            this.componentStores.set(type, new component_1.ComponentStore());
        }
        this.componentStores.get(type).add(entity, component);
        this.eventBus.emit('component-added', { entity, component });
    }
    /** Returns the component of an entity by component class name. */
    getComponent(entity, componentClass) {
        var _a;
        return (_a = this.componentStores.get(componentClass)) === null || _a === void 0 ? void 0 : _a.get(entity);
    }
    /** Returns all components of an entity */
    getAllComponents(entity) {
        const components = [];
        for (let [componentClass, store] of this.componentStores.entries()) {
            const comp = store.get(entity);
            if (comp)
                components.push(comp);
        }
        return components;
    }
    /** Returns all entities. */
    getAllEntities() {
        return this.entities;
    }
    /** Removes a component */
    removeComponent(entity, componentClass) {
        const store = this.componentStores.get(componentClass);
        if (!store)
            return;
        const component = store.get(entity);
        if (component && component.destroy)
            component.destroy();
        this.eventBus.emit('component-removed', { entity, component });
    }
    registerSystem(system) {
        this.systems.push(system);
        system.init(this);
        this.eventBus.emit('system-registered', { system });
    }
    unregisterSystem(system) {
        this.systems.splice(this.systems.indexOf(system), 1);
        this.eventBus.emit('system-unregistered', { system });
    }
    update(dt) {
        for (const system of this.systems) {
            system.update(this, dt);
        }
    }
    /** Queries all entities with the passed in components. Will not go down the child parent hierarchy. */
    *queryEntities(...componentClasses) {
        if (componentClasses.length === 0)
            return;
        const primaryStore = this.componentStores.get(componentClasses[0]);
        if (!primaryStore)
            return;
        const [entities] = primaryStore.getAll();
        for (const entity of entities) {
            const components = [];
            let include = true;
            for (let i = 0; i < componentClasses.length; i++) {
                const cls = componentClasses[i];
                const store = this.componentStores.get(cls);
                if (!store || !store.has(entity)) {
                    include = false;
                    break;
                }
                components[i] = store.get(entity);
            }
            if (include) {
                yield [entity, components];
            }
        }
    }
    /** Queries all entities with the past in components.
     * This function will also include child components when quering a parent component!
     * */
    *queryEntitiesExtended(...componentClasses) {
        var _a, _b;
        if (componentClasses.length === 0)
            return;
        // Step 1: Build the list of component classes, including the parent classes.
        const allComponentClasses = new Set();
        for (const componentClass of componentClasses) {
            let currentClass = componentClass;
            // Traverse the prototype chain to include parent classes
            while (currentClass) {
                allComponentClasses.add(currentClass);
                currentClass = (_b = (_a = Object.getPrototypeOf(currentClass.prototype)) === null || _a === void 0 ? void 0 : _a.constructor) !== null && _b !== void 0 ? _b : null;
            }
        }
        // Step 2: Find the primary store for the first component class
        const primaryStore = this.componentStores.get(componentClasses[0]);
        if (!primaryStore)
            return;
        const [entities] = primaryStore.getAll();
        // Step 3: Query the entities and their components
        for (const entity of entities) {
            const components = [];
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
                components[i] = store.get(entity);
            }
            // If the entity has all requested components, yield it
            if (include) {
                // Step 4: Collect child components for the entity
                const childComponents = [];
                allComponentClasses.forEach(cls => {
                    const store = this.componentStores.get(cls);
                    if (store === null || store === void 0 ? void 0 : store.has(entity)) {
                        childComponents.push(store.get(entity));
                    }
                });
                // Combine the original components with child components
                yield [entity, [...components, ...childComponents]];
            }
        }
    }
    hasTag(entity, tagName) {
        const tag = this.getComponent(entity, tag_component_1.TagComponent);
        return (tag === null || tag === void 0 ? void 0 : tag.tagName) === tagName;
    }
    *queryTagged(tagName, ...componentClasses) {
        const tagStore = this.componentStores.get(tag_component_1.TagComponent);
        if (!tagStore)
            return;
        const [entities] = tagStore.getAll();
        for (const entity of entities) {
            const tag = tagStore.get(entity);
            if (!tag || tag.tagName !== tagName)
                continue;
            // If no components requested, just return the entity
            if (componentClasses.length === 0) {
                yield [entity, []];
                continue;
            }
            const components = [];
            let match = true;
            for (let i = 0; i < componentClasses.length; i++) {
                const cls = componentClasses[i];
                const store = this.componentStores.get(cls);
                if (!store || !store.has(entity)) {
                    match = false;
                    break;
                }
                components[i] = store.get(entity);
            }
            if (match) {
                yield [entity, components];
            }
        }
    }
    getTaggedEntity(tagName, ...componentClasses) {
        const iterator = this.queryTagged(tagName, ...componentClasses)[Symbol.iterator]();
        const result = iterator.next();
        return result.done ? undefined : result.value;
    }
}
exports.ECS = ECS;
