
import * as THREE from 'three'
import { EInput, Input } from './core/input'
import { Globals } from './core/globals'
import { ThirdPersonControl } from './core/third-person-controls'
import { M } from './util/math'
import { Entity } from './core/entity'


export class Player extends Entity {
    
    static list: Player[] = []

    force = new THREE.Vector3()

    /** Offset angle Y used for walking directions */
    directionOffset: number = 0
    /** Velocity of walking speed */
    velocity = 10
    /** Velocity of running speed */
    runVeclocity = 15

    control: ThirdPersonControl
    camera: THREE.PerspectiveCamera

    state: string

    constructor(camera: THREE.PerspectiveCamera) {

        super()

        Player.list.push(this)
            
        this.camera = camera || new THREE.PerspectiveCamera()

        this.construct()

        this.computeNormal()
    }

    construct(): void {
        
        this.state = 'IDLE'

        let m = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 32), new THREE.MeshDistanceMaterial())
        // m.geometry.translate(0, .5, 0)
        // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        m.castShadow = true
        m.receiveShadow = true
        this.add(m)

        this.control = new ThirdPersonControl(this, this.camera, Globals.dom)
        this.control.updateTarget(new THREE.Vector3())
    }

    update(delta: number) {

        this.checkInput()

        if(this.state === 'WALK')
            this.move(delta)

        this.control.update()
    }

    checkInput() {

        this.state = 'IDLE'

        this.directionOffset = 0

        if(Input.on(EInput.FORWARD)) {

            this.state = 'WALK'

            // console.log('forward')
            if(Input.on(EInput.LEFT)) {
                // console.log('right')
                this.directionOffset = Math.PI / 4
            }
            else if(Input.on(EInput.RIGHT)) {
                
                // console.log('left')
                this.directionOffset = -Math.PI / 4
            }
        }
        else if(Input.on(EInput.BACK)) {

            this.state = 'WALK'

            // console.log('back')
            if(Input.on(EInput.LEFT)) {

                // console.log('right')
                this.directionOffset = Math.PI / 4 + Math.PI / 2
            }
            else if(Input.on(EInput.RIGHT)) {
                
                // console.log('left')
                this.directionOffset = -Math.PI / 4 - Math.PI / 2
            }
            else {

                this.directionOffset = Math.PI
            }
        }
        else if(Input.on(EInput.LEFT)) {
            
            // console.log('left')
            this.state = 'WALK'
            this.directionOffset = Math.PI / 2
        }
        else if(Input.on(EInput.RIGHT)) {

            // console.log('right')
            this.state = 'WALK'
            this.directionOffset = -Math.PI / 2
        }
    }

    get angleYCameraDirection() {

        return Math.atan2((this.camera.position.x - this.position.x), this.camera.position.z - this.position.z)
    }

    move(delta: number) {

        this.quaternion.setFromAxisAngle(M.UP, this.angleYCameraDirection + this.directionOffset)
        this.quaternion.rotateTowards(this.quaternion, .24)

        this.getWorldDirection(this.normal)
        this.normal.y = 0
        this.normal.normalize()
        this.normal.applyAxisAngle(M.UP, this.directionOffset)

        this.force.x = this.normal.x * this.velocity * delta
        this.force.z = this.normal.z * this.velocity * delta

        this.position.x += this.force.x
        this.position.z += this.force.z
        this.updateMatrix()

        this.position.copy(this.position)

        this.control.updateTarget(this.force)
    }

    getWorldDirection(target: THREE.Vector3): THREE.Vector3 {
        
        if(this.camera) this.camera.getWorldDirection(target)
        return target
    }

    destruct(): void {

        Player.list.splice(Player.list.indexOf(this))
    }
}