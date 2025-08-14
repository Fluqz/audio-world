"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphicsComponent = void 0;
const three_1 = require("three");
const game_1 = require("../../client/game");
class GraphicsComponent {
    constructor(object) {
        this.object = object;
        this.object.traverse(o => {
            o.matrixAutoUpdate = false;
        });
        game_1.Game.i.manager.scene.add(this.object);
    }
    getSize() {
        const bbox = new three_1.Box3();
        bbox.setFromObject(this.object);
        const size = new three_1.Vector3();
        bbox.getSize(size);
        return size;
    }
    getCenter() {
        const bbox = new three_1.Box3();
        bbox.setFromObject(this.object);
        const center = new three_1.Vector3();
        bbox.getCenter(center);
        return center;
    }
}
exports.GraphicsComponent = GraphicsComponent;
//# sourceMappingURL=graphics-component.js.map