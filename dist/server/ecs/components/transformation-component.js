"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformationComponent = void 0;
const three_1 = require("three");
class TransformationComponent {
    constructor(data) {
        this.useQuaternion = false;
        this.position = new three_1.Vector3();
        this.rotation = new three_1.Euler();
        this.quaternion = new three_1.Quaternion();
        this.scale = new three_1.Vector3(1, 1, 1);
        if (data) {
            this.position.fromArray(data.position);
            this.rotation.fromArray(data.rotation);
            this.quaternion.fromArray(data.quaternion);
            this.scale.fromArray(data.scale);
        }
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
