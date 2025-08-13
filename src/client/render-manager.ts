import { Globals } from '../globals'
import { Mesh } from 'three/src/objects/Mesh';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { Scene } from 'three/src/scenes/Scene';
import * as THREE from 'three';
import { MeshBVHUniformStruct, FloatVertexAttributeTexture, BVHShaderGLSL } from 'three-mesh-bvh';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
export class RenderManager {

    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer



    private backgroundColor = 0xffFF00 // ffe5b9 0xf4eedb 0xffe800

    constructor() {
        
        this.scene = new Scene()

        // this.renderer = new THREE.WebGLRenderer({ antialias: true })
        // this.renderer.setSize(Globals.w, Globals.h)
        // this.renderer.setClearColor(this.backgroundColor)
        // this.renderer.shadowMap.enabled = true
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap


        this.renderer = new WebGLRenderer( { antialias: false } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor(this.backgroundColor)
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        this.camera = new PerspectiveCamera(45, Globals.w / Globals.h, .1, 1000)
        this.camera.position.set(0, 0, 5)
        this.camera.lookAt(0, 0, 0)
    }

    render() {


        if (true) {

            this.camera.updateMatrixWorld();
            this.camera.updateProjectionMatrix();

            // Clear screen + depth buffer
            this.renderer.setRenderTarget(null);
            this.renderer.setClearColor(this.backgroundColor)
            this.renderer.clear(true, true, true);

            let i = 0
            this.scene.traverse(o => {

                if(o['isMesh'] && o.userData.rtQuad) {

                    const m = o as Mesh
                    const rtMaterial = m.material as THREE.ShaderMaterial
                                        
                    const bt: any = m.geometry.boundsTree;

                    m.updateMatrixWorld()
                    
                    const uniforms = rtMaterial.uniforms

                    uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld);
                    uniforms.invProjectionMatrix.value.copy(this.camera.projectionMatrixInverse);

                    uniforms.projectionMatrix.value.copy(this.camera.projectionMatrix);
                    // uniforms.viewMatrix.value.copy(this.camera.matrixWorldInverse);

                    // Per-mesh transforms
                    uniforms.invModelMatrix.value.copy(m.matrixWorld).invert();
                    uniforms.objectMatrix.value.copy(m.matrixWorld); // <-- NEW

                    // Per-mesh data
                    uniforms.bvh.value.updateFrom(m.geometry.boundsTree);
                    uniforms.normalAttribute.value.updateFrom(m.geometry.attributes.normal);

                    m.userData.rtQuad.render(this.renderer);

                    i++
                }
            })
        } 
        else {

            this.renderer.render(this.scene, this.camera)
        }
    }

    resize(width: number, height: number) {
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    }
}
