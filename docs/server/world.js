"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
// ecs-world.js (server)
class World {
    constructor() {
        this.players = [];
        // ...your component store setup
    }
    createPlayer() { }
    removePlayer(id) { }
    handleInput(id, input) { }
    serializeState() {
        return this.players.map(p => ({
            id: p.id,
            position: this.getComponent(p.id, "Position"),
            rotation: this.getComponent(p.id, "Rotation")
        }));
    }
}
exports.World = World;
