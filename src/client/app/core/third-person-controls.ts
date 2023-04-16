
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


export class ThirdPersonControl {

    public camera: THREE.PerspectiveCamera
    public dom: HTMLElement

    public cameraTarget: THREE.Vector3

    public orbit: OrbitControls

    public camDistance: number = 10

    constructor(camera: THREE.PerspectiveCamera, dom: HTMLElement) {

        this.camera = camera
        this.dom = dom

        this.cameraTarget = new THREE.Vector3()

        this.camera.position.setLength(this.camDistance)
        this.camera.updateMatrix()

        this.orbit = new OrbitControls(this.camera, this.dom)
        this.orbit.enablePan = false
        // this.orbit.enableKeys = false
        this.orbit.screenSpacePanning = false
    }

    update() {}


    updateCamera(force: THREE.Vector3) {

        this.camera.position.x += force.x
        this.camera.position.z += force.z
    }

    updateTarget(position: THREE.Vector3) {

        this.cameraTarget.x = position.x
        this.cameraTarget.y = position.y + 2
        this.cameraTarget.z = position.z
        
        this.orbit.target = this.cameraTarget

        this.orbit.update()
    }
}