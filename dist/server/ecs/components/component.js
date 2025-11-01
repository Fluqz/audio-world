"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentStore = void 0;
/** Class that holds all components of one type of component. */
class ComponentStore {
    constructor() {
        /** Array of entities */
        this.entities = [];
        /** Array of components */
        this.components = [];
        /*+ index that references a entity to a component of type T */
        this.entityToIndex = new Map();
    }
    /** Adds a component to the store and references the entity. */
    add(entity, component) {
        if (this.entityToIndex.has(entity))
            return;
        const index = this.entities.length;
        this.entities.push(entity);
        this.components.push(component);
        this.entityToIndex.set(entity, index);
    }
    /** Returns a component from the store by entity. */
    get(entity) {
        const index = this.entityToIndex.get(entity);
        if (index === undefined)
            return undefined;
        return this.components[index];
    }
    /** Removes  */
    remove(entity) {
        const index = this.entityToIndex.get(entity);
        if (index === undefined)
            return;
        const lastIndex = this.entities.length - 1;
        if (index !== lastIndex) { // TODO _ WHY SWAP? WHATS GOING ON?
            // Swap with last element
            const lastEntity = this.entities[lastIndex];
            this.entities[index] = lastEntity;
            this.components[index] = this.components[lastIndex];
            this.entityToIndex.set(lastEntity, index);
        }
        this.entities.pop();
        this.components.pop();
        this.entityToIndex.delete(entity);
    }
    /** Checks for a entity */
    has(entity) {
        return this.entityToIndex.has(entity);
    }
    /** Returns all entities and all components */
    getAll() {
        return [this.entities, this.components];
    }
}
exports.ComponentStore = ComponentStore;
