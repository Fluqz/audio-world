"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPersonControllerComponent = void 0;
const three_1 = require("three");
const third_person_controls_1 = require("../third-person-controls");
class ThirdPersonControllerComponent {
    constructor(camera, dom) {
        /** vector 3 storing the force */
        this.force = new three_1.Vector3();
        /** Normalized facing direction of object */
        this.normal = new three_1.Vector3();
        /** Offset angle Y used for walking directions */
        this.directionOffset = 0;
        /** Velocity of walking speed */
        this.velocity = 15;
        /** Velocity of running speed */
        this.runVeclocity = 30;
        this.camera = camera;
        this.dom = dom;
        this.state = 'IDLE';
        this.control = new third_person_controls_1.ThirdPersonControl(this.camera, this.dom);
        this.control.updateTarget(new three_1.Vector3());
    }
}
exports.ThirdPersonControllerComponent = ThirdPersonControllerComponent;
//# sourceMappingURL=third-person-controller-component.js.map