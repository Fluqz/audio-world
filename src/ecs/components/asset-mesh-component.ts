import { Box3, Object3D, Vector3 } from "three";
import { Component, ComponentData } from "./component";
import { Game } from "../../client/game";
import { AssetManager } from "../../shared/asset-manager";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Utils } from "../../shared/util/utils";
import { MeshComponent } from "./mesh-component";


export class AssetMeshComponent extends MeshComponent {

    path: string
    
    gltf: GLTF

    constructor(path: string) {
        super()

        this.path = path

        this.object = new Object3D()
        this.object.matrixAutoUpdate = false
        this.object.name = 'mesh-component'

        Game.i.renderManager.scene.add(this.object)

        this.loadModel(this.path)
    }

    loadModel(path:string) {

        this.unloadModel()

        AssetManager.load(path).then((gltf: GLTF) => {

            this.gltf = gltf

            const model = gltf.scene

            this.object.add(model)
        })
    }

    unloadModel() {

        if(this.gltf) {

            Utils.dispose(this.gltf.scene)
        }

        Utils.dispose(this.object)
    }


    serialize(): ComponentData {
        return {

            path: this.path
        }
    }
}