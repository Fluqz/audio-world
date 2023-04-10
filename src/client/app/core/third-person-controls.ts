
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


export class ThirdPersonControl {

    public obj: THREE.Object3D
    public camera: THREE.PerspectiveCamera
    public dom: HTMLElement

    public cameraTarget: THREE.Vector3

    public orbit: OrbitControls

    public camDistance: number = 10

    constructor(obj: THREE.Object3D, camera: THREE.PerspectiveCamera, dom: HTMLElement) {

        this.obj = obj
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

    update() {
    }

    updateTarget(position: THREE.Vector3) {

        this.camera.position.x += position.x
        this.camera.position.z += position.z

        this.cameraTarget.x = this.obj.position.x
        this.cameraTarget.y = this.obj.position.y + 1
        this.cameraTarget.z = this.obj.position.z
        this.orbit.target = this.cameraTarget

        this.orbit.update()
    }
}