
import * as THREE from "three"
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class AssetManager {

    static assets = new Map()
    
    static mgmt = new THREE.LoadingManager()
    static gltfLoader = new GLTFLoader(AssetManager.mgmt)

    static _onload : () => void
    static get onload() { return this._onload }
    static set onload(o) { 
        this._onload = o
        this.mgmt.onLoad = this._onload
    }

    static load(path: string) {

        return new Promise<GLTF>((resolve, reject) => {

            if(!path) reject()

            let gltf = AssetManager.assets.get(path)
    
            if(gltf) {
                // console.log('CLONE')
                resolve(gltf)
            }
    
            AssetManager.gltfLoader.load(path, (gltf)=> {
    
                AssetManager.assets.set(path, gltf)

                resolve(gltf)
            },
            undefined,// progress => {  },
            error => { console.error(error); reject(); })
        })
    }

}