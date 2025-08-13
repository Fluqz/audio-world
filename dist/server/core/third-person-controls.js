"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPersonControl = void 0;
const THREE = __importStar(require("three"));
const OrbitControls_1 = require("three/examples/jsm/controls/OrbitControls");
class ThirdPersonControl {
    constructor(camera, dom) {
        this.camDistance = 10;
        this.camera = camera;
        this.dom = dom;
        this.cameraTarget = new THREE.Vector3();
        this.camera.position.setLength(this.camDistance);
        this.camera.updateMatrix();
        this.orbit = new OrbitControls_1.OrbitControls(this.camera, this.dom);
        this.orbit.enablePan = false;
        // this.orbit.enableKeys = false
        this.orbit.screenSpacePanning = false;
    }
    update() { }
    updateCamera(force) {
        this.camera.position.x += force.x;
        this.camera.position.z += force.z;
    }
    updateTarget(position) {
        this.cameraTarget.x = position.x;
        this.cameraTarget.y = position.y + 2;
        this.cameraTarget.z = position.z;
        this.orbit.target = this.cameraTarget;
        this.orbit.update();
    }
}
exports.ThirdPersonControl = ThirdPersonControl;
//# sourceMappingURL=third-person-controls.js.map