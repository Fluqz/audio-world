"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentStore = void 0;
class ComponentStore {
    constructor() {
        this.entities = [];
        this.components = [];
        this.entityToIndex = new Map();
    }
    add(entity, component) {
        if (this.entityToIndex.has(entity))
            return;
        const index = this.entities.length;
        this.entities.push(entity);
        this.components.push(component);
        this.entityToIndex.set(entity, index);
    }
    get(entity) {
        const index = this.entityToIndex.get(entity);
        if (index === undefined)
            return undefined;
        return this.components[index];
    }
    remove(entity) {
        const index = this.entityToIndex.get(entity);
        if (index === undefined)
            return;
        const lastIndex = this.entities.length - 1;
        if (index !== lastIndex) {
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
    has(entity) {
        return this.entityToIndex.has(entity);
    }
    getAll() {
        return [this.entities, this.components];
    }
}
exports.ComponentStore = ComponentStore;
//# sourceMappingURL=component.js.map