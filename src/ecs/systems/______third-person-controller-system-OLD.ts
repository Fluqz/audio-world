import { ThirdPersonControllerComponent } from "../components/third-person-controller-component-OLD"
import { TransformationComponent } from "../components/transformation-component"
import { EInput, Input } from "../../shared/input"
import { System } from "./system"
import { M } from "../../shared/util/math"

// import io from "socket.io-client"
import { ECS } from "../ecs"
// const socket = io()

export enum FPSState {

    IDLE,
    WALK,
    RUN
}

export class FirstPersonControllerSystem extends System {

    private TPSComponent: ThirdPersonControllerComponent
    private transform: TransformationComponent

    update(ecs: ECS, delta: number): void {

        for(let [e, [TPSComponent, transform]] of ecs.queryEntities(ThirdPersonControllerComponent, TransformationComponent)) {

            this.TPSComponent = TPSComponent
            this.transform = transform

            this.checkInput()

            if(this.TPSComponent.state === 'WALK')
                this.move(delta)

            this.TPSComponent.control.update()
        }
    }

    checkInput() {

        this.TPSComponent.state = 'IDLE'

        this.TPSComponent.directionOffset = 0

        if(Input.on(EInput.FORWARD)) {

            this.TPSComponent.state = 'WALK'

            // console.log('forward')
            if(Input.on(EInput.LEFT)) {
                // console.log('right')
                this.TPSComponent.directionOffset = Math.PI / 4
            }
            else if(Input.on(EInput.RIGHT)) {
                
                // console.log('left')
                this.TPSComponent.directionOffset = -Math.PI / 4
            }
        }
        else if(Input.on(EInput.BACK)) {

            this.TPSComponent.state = 'WALK'

            // console.log('back')
            if(Input.on(EInput.LEFT)) {

                // console.log('right')
                this.TPSComponent.directionOffset = Math.PI / 4 + Math.PI / 2
            }
            else if(Input.on(EInput.RIGHT)) {
                
                // console.log('left')
                this.TPSComponent.directionOffset = -Math.PI / 4 - Math.PI / 2
            }
            else {

                this.TPSComponent.directionOffset = Math.PI
            }
        }
        else if(Input.on(EInput.LEFT)) {
            
            // console.log('left')
            this.TPSComponent.state = 'WALK'
            this.TPSComponent.directionOffset = Math.PI / 2
        }
        else if(Input.on(EInput.RIGHT)) {

            // console.log('right')
            this.TPSComponent.state = 'WALK'
            this.TPSComponent.directionOffset = -Math.PI / 2
        }
    }


    move(delta: number) {

        const vel = Input.on(EInput.RUN) == false ? this.TPSComponent.velocity : this.TPSComponent.runVeclocity

        this.transform.quaternion.setFromAxisAngle(M.UP, this.angleYCameraDirection + this.TPSComponent.directionOffset)
        this.transform.quaternion.rotateTowards(this.transform.quaternion, .24)

        this.getWorldDirection(this.TPSComponent.normal)
        this.TPSComponent.normal.y = 0
        this.TPSComponent.normal.normalize()
        this.TPSComponent.normal.applyAxisAngle(M.UP, this.TPSComponent.directionOffset)

        this.TPSComponent.force.x = this.TPSComponent.normal.x * vel * delta
        this.TPSComponent.force.z = this.TPSComponent.normal.z * vel * delta

        this.transform.position.x += this.TPSComponent.force.x
        this.transform.position.z += this.TPSComponent.force.z

        this.transform.needsUpdate = true

        this.TPSComponent.control.updateCamera(this.TPSComponent.force)
        this.TPSComponent.control.updateTarget(this.transform.position)
    }

    getWorldDirection(target: THREE.Vector3): THREE.Vector3 {
        
        if(this.TPSComponent.camera) this.TPSComponent.camera.getWorldDirection(target)
        return target
    }

    get angleYCameraDirection() {

        return Math.atan2((this.TPSComponent.camera.position.x - this.transform.position.x), this.TPSComponent.camera.position.z - this.transform.position.z)
    }
}