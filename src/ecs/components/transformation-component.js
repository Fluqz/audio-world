"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformationComponent = void 0;
const three_1 = require("three");
class TransformationComponent {
    constructor(position, rotation, quaternion, scale) {
        this.position = position == undefined ? new three_1.Vector3() : position;
        this.rotation = rotation == undefined ? new three_1.Euler() : rotation;
        this.quaternion = quaternion == undefined ? new three_1.Quaternion() : quaternion;
        this.scale = scale == undefined ? new three_1.Vector3(1, 1, 1) : scale;
        // this.matrix = new Matrix4().setPosition(this.position)
        // this.matrix = new Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z)
        // this.matrix = new Matrix4().makeRotationFromQuaternion(this.quaternion)
        // this.matrix = new Matrix4().makeRotationFromEuler(this.rotation)
        this.needsUpdate = false;
    }
}
exports.TransformationComponent = TransformationComponent;
