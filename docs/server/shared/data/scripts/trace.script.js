"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceScript = void 0;
const three_1 = require("three");
const transformation_component_1 = require("../../../../ecs/components/transformation-component");
const game_1 = require("../../../game/game");
const utils_1 = require("../../util/utils");
/** Script class that draws a path which shows the way the entity was moving. */
class TraceScript {
    constructor() {
        this.points = [];
        this.start = (entity, ecs) => {
            this.geometry = new three_1.BufferGeometry().setFromPoints(this.points);
            this.trace = new three_1.Line(this.geometry, new three_1.LineBasicMaterial({ color: 0x000000, depthTest: false, depthWrite: false }));
            this.transform = ecs.getComponent(entity, transformation_component_1.TransformationComponent);
            game_1.Game.i.manager.scene.add(this.trace);
            this.lastPosition = new three_1.Vector3().copy(this.transform.position);
        };
        this.update = (delta) => {
            if (this.lastPosition.equals(this.transform.position))
                return;
            if (this.points.length > 5000) {
                this.v = this.points.shift();
                this.v.copy(this.transform.position);
            }
            else
                this.v = this.transform.position.clone();
            this.points.push(this.v);
            this.geometry.setFromPoints(this.points);
            this.geometry.computeBoundingSphere();
        };
        this.destroy = () => {
            utils_1.Utils.dispose(this.trace);
        };
    }
}
exports.TraceScript = TraceScript;
//# sourceMappingURL=trace.script.js.map