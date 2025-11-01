"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
class System {
    init(ecs) {
        const match = (entity) => this.tryTrackEntity(ecs, entity);
        // Subscribe to relevant ECS events
        ecs.events.on('component-added', ({ entity }) => match(entity));
        ecs.events.on('component-removed', ({ entity }) => match(entity));
        ecs.events.on('entity-removed', (entity) => this.removeEntity(entity));
        // Initial population
        for (const entity of ecs.getAllEntities()) {
            match(entity);
        }
    }
    /** Tries to track an entity if it holds the required components for this system.
     * If not the entity will be removed
     * if its not already tracked it will be added to the tracked entities.
     */
    tryTrackEntity(ecs, entity) {
        var _a, _b;
        const hasAll = this.components.every(cls => ecs.getComponent(entity, cls));
        const isTracked = this.entities.has(entity);
        if (hasAll && !isTracked) {
            console.log('track', entity);
            const comps = this.components.map(cls => ecs.getComponent(entity, cls));
            this.entities.set(entity, comps);
            (_a = this.onEntityAdded) === null || _a === void 0 ? void 0 : _a.call(this, entity, comps);
        }
        else if (!hasAll && isTracked) {
            this.entities.delete(entity);
            (_b = this.onEntityRemoved) === null || _b === void 0 ? void 0 : _b.call(this, entity);
        }
    }
    /** Removes the entity from this system. */
    removeEntity(entity) {
        var _a;
        if (this.entities.has(entity)) {
            this.entities.delete(entity);
            (_a = this.onEntityRemoved) === null || _a === void 0 ? void 0 : _a.call(this, entity);
        }
    }
}
exports.System = System;
