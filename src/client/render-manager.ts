import * as THREE from 'three'
import { Globals } from '../globals'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class RenderManager {

    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    orbit: OrbitControls

    private backgroundColor = 0xffe800 // ffe5b9 0xf4eedb 0xffe800

    constructor() {
        
        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(Globals.w, Globals.h)
        this.renderer.setClearColor(this.backgroundColor)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.camera = new THREE.PerspectiveCamera(45, Globals.w / Globals.h, .1, 1000)
        this.camera.position.set(0, 0, -15)
        this.camera.lookAt(0, 0, 0)

        this.orbit = new OrbitControls(this.camera, Globals.dom)
        this.orbit.enablePan = false
        this.orbit.screenSpacePanning = false
        this.orbit.target.set(0, 0, 0)
        this.orbit.update()
        this.orbit.saveState()
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    resize(width: number, height: number, ratio: number) {

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(ratio)
    }
}
