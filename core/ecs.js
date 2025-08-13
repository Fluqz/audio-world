"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECS = void 0;
const component_1 = require("../core/components/component");
const script_component_1 = require("./components/script-component");
const tag_component_1 = require("./components/tag-component");
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
        for (const [type, store] of this.componentStores.entries()) {
            const comp = store.get(entity);
            if (comp && typeof comp.onDestroy === "function") {
                comp.destroy(entity, this);
            }
            store.remove(entity);
        }
        this.entities.delete(entity);
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
    addTag(entity, tagName) {
        this.addComponent(entity, new tag_component_1.TagComponent(tagName));
    }
    hasTag(entity, tagName) {
        const tag = this.getComponent(entity, tag_component_1.TagComponent);
        return (tag === null || tag === void 0 ? void 0 : tag.tagName) === tagName;
    }
    *queryTagged(tagName, ...componentClasses) {
        const tagStore = this.componentStores.get(tag_component_1.TagComponent);
        if (!tagStore)
            return;
        console.log('tagStores', tagStore);
        const [entities] = tagStore.getAll();
        for (const entity of entities) {
            const tag = tagStore.get(entity);
            if (!tag || tag.tag !== tagName)
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
