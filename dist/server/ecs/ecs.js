"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECS = void 0;
const component_1 = require("./components/component");
const script_component_1 = require("./components/script-component");
const tag_component_1 = require("./components/tag-component");
const name_component_1 = require("./components/name-component");
class ECS {
    constructor() {
        this.nextEntityId = 0;
        this.entities = new Set();
        this.componentStores = new Map();
        this.systems = [];
    }
    createEntity() {
        const id = this.nextEntityId++;
        this.entities.add(id);
        return id;
    }
    loadPrefabFile(path) {
        const jsonString = null;
        return jsonString;
    }
    createFromPrefab(prefab) {
        const entity = this.createEntity();
        if (prefab.name)
            this.addName(entity, prefab.name);
        if (prefab.components) {
            for (let comp of prefab.components) {
                console.log('comp', comp);
            }
        }
    }
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
    }
    entityExists(entity) {
        return this.entities.has(entity);
    }
    addComponent(entity, component) {
        const type = component.constructor;
        if (!this.componentStores.has(type)) {
            this.componentStores.set(type, new component_1.ComponentStore());
        }
        this.componentStores.get(type).add(entity, component);
    }
    getComponent(entity, componentClass) {
        var _a;
        return (_a = this.componentStores.get(componentClass)) === null || _a === void 0 ? void 0 : _a.get(entity);
    }
    getAllComponents(entity) {
        const components = [];
        for (let [componentClass, store] of this.componentStores.entries()) {
            const comp = store.get(entity);
            if (comp)
                components.push(comp);
        }
        return components;
    }
    getAllEntities() {
        return this.entities;
    }
    removeComponent(entity, componentClass) {
        var _a;
        (_a = this.componentStores.get(componentClass)) === null || _a === void 0 ? void 0 : _a.remove(entity);
    }
    registerSystem(system) {
        this.systems.push(system);
    }
    unregisterSystem(system) {
        this.systems.splice(this.systems.indexOf(system), 1);
    }
    update(dt) {
        for (const system of this.systems) {
            system.update(this, dt);
        }
    }
    /** Queries all entities with the past in components. Will not go down the child parent hierarchy. */
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
    addName(entity, name) {
        this.addComponent(entity, new name_component_1.NameComponent({ name }));
    }
    addTag(entity, tagName) {
        this.addComponent(entity, new tag_component_1.TagComponent({ tagName }));
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
