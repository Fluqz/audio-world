import { M } from "../../util/math"
import { FirstPersonControllerComponent } from "../components/first-person-controller-component"
import { Component, EComponents } from "../components/component"
import { TransformationComponent } from "../components/transformation-component"
import { Entity } from "../entity"
import { EInput, Input } from "../input"
import { System } from "./system"


export enum FPSState {

    IDLE,
    WALK,
    RUN,
}

export class FirstPersonControllerSystem implements System {

    requiredComponents: EComponents[] = [EComponents.FIRST_PERSON_CONTROLLER, EComponents.TRANSFORMATION]

    private FPSComponent: FirstPersonControllerComponent
    private transform: TransformationComponent

    process(entities: Entity[], delta: number): void {

        let process: boolean
        for(let e of entities) {

            process = true

            for(let c of this.requiredComponents) {
                
                // console.log(c,e.getComponent(c))
                if(!e.getComponent(c)) {

                    process = false
                }
            }
                        
            if(!process) continue
            
            this.FPSComponent = e.getComponent(EComponents.FIRST_PERSON_CONTROLLER) as FirstPersonControllerComponent
            this.transform = e.getComponent(EComponents.TRANSFORMATION) as TransformationComponent

            this.checkInput()

            if(this.FPSComponent.state === 'WALK')
                this.move(delta)

            this.FPSComponent.control.update()
        }
    }

    checkInput() {

        this.FPSComponent.state = 'IDLE'

        this.FPSComponent.directionOffset = 0

        if(Input.on(EInput.FORWARD)) {

            this.FPSComponent.state = 'WALK'

            // console.log('forward')
            if(Input.on(EInput.LEFT)) {
                // console.log('right')
                this.FPSComponent.directionOffset = Math.PI / 4
            }
            else if(Input.on(EInput.RIGHT)) {
                
                // console.log('left')
                this.FPSComponent.directionOffset = -Math.PI / 4
            }
        }
        else if(Input.on(EInput.BACK)) {

            this.FPSComponent.state = 'WALK'

            // console.log('back')
            if(Input.on(EInput.LEFT)) {

                // console.log('right')
                this.FPSComponent.directionOffset = Math.PI / 4 + Math.PI / 2
            }
            else if(Input.on(EInput.RIGHT)) {
                
                // console.log('left')
                this.FPSComponent.directionOffset = -Math.PI / 4 - Math.PI / 2
            }
            else {

                this.FPSComponent.directionOffset = Math.PI
            }
        }
        else if(Input.on(EInput.LEFT)) {
            
            // console.log('left')
            this.FPSComponent.state = 'WALK'
            this.FPSComponent.directionOffset = Math.PI / 2
        }
        else if(Input.on(EInput.RIGHT)) {

            // console.log('right')
            this.FPSComponent.state = 'WALK'
            this.FPSComponent.directionOffset = -Math.PI / 2
        }
    }

    get angleYCameraDirection() {

        return Math.atan2((this.FPSComponent.camera.position.x - this.transform.position.x), this.FPSComponent.camera.position.z - this.transform.position.z)
    }

    move(delta: number) {

        const vel = Input.on(EInput.RUN) == false ? this.FPSComponent.velocity : this.FPSComponent.runVeclocity

        this.transform.quaternion.setFromAxisAngle(M.UP, this.angleYCameraDirection + this.FPSComponent.directionOffset)
        this.transform.quaternion.rotateTowards(this.transform.quaternion, .24)

        this.getWorldDirection(this.FPSComponent.normal)
        this.FPSComponent.normal.y = 0
        this.FPSComponent.normal.normalize()
        this.FPSComponent.normal.applyAxisAngle(M.UP, this.FPSComponent.directionOffset)

        this.FPSComponent.force.x = this.FPSComponent.normal.x * vel * delta
        this.FPSComponent.force.z = this.FPSComponent.normal.z * vel * delta

        this.transform.position.x += this.FPSComponent.force.x
        this.transform.position.z += this.FPSComponent.force.z

        this.transform.needsUpdate = true

        this.FPSComponent.control.updateTarget(this.FPSComponent.force)
    }

    getWorldDirection(target: THREE.Vector3): THREE.Vector3 {
        
        if(this.FPSComponent.camera) this.FPSComponent.camera.getWorldDirection(target)
        return target
    }
}