"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformationComponent = void 0;
const three_1 = require("three");
class TransformationComponent {
    constructor(position, rotation, quaternion, scale) {
        this.eulerOverQuaternions = false;
        this.position = position == undefined ? new three_1.Vector3() : new three_1.Vector3().fromArray(position);
        this.rotation = rotation == undefined ? new three_1.Euler() : new three_1.Euler().fromArray(rotation);
        this.quaternion = quaternion == undefined ? new three_1.Quaternion() : new three_1.Quaternion().fromArray(quaternion);
        this.scale = scale == undefined ? new three_1.Vector3(1, 1, 1) : new three_1.Vector3().fromArray(scale);
        this.needsUpdate = false;
    }
    serialize() {
        return {
            position: this.position.toArray(),
            rotation: this.rotation.toArray(),
            quaternion: this.quaternion.toArray(),
            scale: this.scale.toArray(),
        };
    }
}
exports.TransformationComponent = TransformationComponent;
