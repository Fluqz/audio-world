"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
const transformation_component_1 = require("../core/components/transformation-component");
// ecs-world.js (server)
class World {
    constructor() {
        this.players = new Set();
        // ...your component store setup
    }
    createPlayer() {
        const entity = this.ecs.createEntity();
        this.ecs.addComponent(entity, transformation_component_1.TransformationComponent);
        if (this.players.has(entity))
            this.players.add(entity);
        return entity;
    }
    removePlayer(entity) {
        this.players.delete(entity);
        this.ecs.destroyEntity(entity);
    }
    handleInput(entity, input) {
        // Game-specific input handling that modifies ECS components
    }
    serializeState() {
        return this.players.map(p => ({
            id: p,
            position: this.ecs.getComponent(p, transformation_component_1.TransformationComponent),
        }));
    }
}
exports.World = World;
