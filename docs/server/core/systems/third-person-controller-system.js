"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirstPersonControllerSystem = exports.FPSState = void 0;
const third_person_controller_component_1 = require("../components/third-person-controller-component");
const transformation_component_1 = require("../components/transformation-component");
const input_1 = require("../../shared/input");
const system_1 = require("./system");
const math_1 = require("../../shared/util/math");
// const socket = io()
var FPSState;
(function (FPSState) {
    FPSState[FPSState["IDLE"] = 0] = "IDLE";
    FPSState[FPSState["WALK"] = 1] = "WALK";
    FPSState[FPSState["RUN"] = 2] = "RUN";
})(FPSState = exports.FPSState || (exports.FPSState = {}));
class FirstPersonControllerSystem extends system_1.System {
    update(ecs, delta) {
        for (let [e, [TPSComponent, transform]] of ecs.queryEntities(third_person_controller_component_1.ThirdPersonControllerComponent, transformation_component_1.TransformationComponent)) {
            this.TPSComponent = TPSComponent;
            this.transform = transform;
            this.checkInput();
            if (this.TPSComponent.state === 'WALK')
                this.move(delta);
            this.TPSComponent.control.update();
        }
    }
    checkInput() {
        this.TPSComponent.state = 'IDLE';
        this.TPSComponent.directionOffset = 0;
        if (input_1.Input.on(input_1.EInput.FORWARD)) {
            this.TPSComponent.state = 'WALK';
            // console.log('forward')
            if (input_1.Input.on(input_1.EInput.LEFT)) {
                // console.log('right')
                this.TPSComponent.directionOffset = Math.PI / 4;
            }
            else if (input_1.Input.on(input_1.EInput.RIGHT)) {
                // console.log('left')
                this.TPSComponent.directionOffset = -Math.PI / 4;
            }
        }
        else if (input_1.Input.on(input_1.EInput.BACK)) {
            this.TPSComponent.state = 'WALK';
            // console.log('back')
            if (input_1.Input.on(input_1.EInput.LEFT)) {
                // console.log('right')
                this.TPSComponent.directionOffset = Math.PI / 4 + Math.PI / 2;
            }
            else if (input_1.Input.on(input_1.EInput.RIGHT)) {
                // console.log('left')
                this.TPSComponent.directionOffset = -Math.PI / 4 - Math.PI / 2;
            }
            else {
                this.TPSComponent.directionOffset = Math.PI;
            }
        }
        else if (input_1.Input.on(input_1.EInput.LEFT)) {
            // console.log('left')
            this.TPSComponent.state = 'WALK';
            this.TPSComponent.directionOffset = Math.PI / 2;
        }
        else if (input_1.Input.on(input_1.EInput.RIGHT)) {
            // console.log('right')
            this.TPSComponent.state = 'WALK';
            this.TPSComponent.directionOffset = -Math.PI / 2;
        }
    }
    move(delta) {
        const vel = input_1.Input.on(input_1.EInput.RUN) == false ? this.TPSComponent.velocity : this.TPSComponent.runVeclocity;
        this.transform.quaternion.setFromAxisAngle(math_1.M.UP, this.angleYCameraDirection + this.TPSComponent.directionOffset);
        this.transform.quaternion.rotateTowards(this.transform.quaternion, .24);
        this.getWorldDirection(this.TPSComponent.normal);
        this.TPSComponent.normal.y = 0;
        this.TPSComponent.normal.normalize();
        this.TPSComponent.normal.applyAxisAngle(math_1.M.UP, this.TPSComponent.directionOffset);
        this.TPSComponent.force.x = this.TPSComponent.normal.x * vel * delta;
        this.TPSComponent.force.z = this.TPSComponent.normal.z * vel * delta;
        this.transform.position.x += this.TPSComponent.force.x;
        this.transform.position.z += this.TPSComponent.force.z;
        this.transform.needsUpdate = true;
        this.TPSComponent.control.updateCamera(this.TPSComponent.force);
        this.TPSComponent.control.updateTarget(this.transform.position);
    }
    getWorldDirection(target) {
        if (this.TPSComponent.camera)
            this.TPSComponent.camera.getWorldDirection(target);
        return target;
    }
    get angleYCameraDirection() {
        return Math.atan2((this.TPSComponent.camera.position.x - this.transform.position.x), this.TPSComponent.camera.position.z - this.transform.position.z);
    }
}
exports.FirstPersonControllerSystem = FirstPersonControllerSystem;
//# sourceMappingURL=third-person-controller-system.js.map