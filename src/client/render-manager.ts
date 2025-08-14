import * as THREE from 'three'
import { Globals } from '../globals'

export class RenderManager {

    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer

    private backgroundColor = 0xffe800 // ffe5b9 0xf4eedb 0xffe800

    constructor() {
        
        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(Globals.w, Globals.h)
        this.renderer.setClearColor(this.backgroundColor)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.camera = new THREE.PerspectiveCamera(45, Globals.w / Globals.h, .1, 1000)
        this.camera.position.set(0, 0, 5)
        this.camera.lookAt(0, 0, 0)
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    resize(width: number, height: number) {
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    }
}
