import { Box3, Object3D, Vector3 } from "three";
import { Component, ComponentData } from "./component";
import { Game } from "../../client/game";
import { AssetManager } from "../../shared/asset-manager";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Utils } from "../../shared/util/utils";


export class MeshComponent implements Component {
    __componentBrand: true

    // Runtime
    object: Object3D


    getSize() {

        const size = new Vector3()

        if(this.object == undefined) return size

        const bbox = new Box3()
        bbox.setFromObject(this.object)

        bbox.getSize(size)

        return size
    }

    getCenter() {

        const center = new Vector3()

        if(this.object == undefined) return center

        const bbox = new Box3()
        bbox.setFromObject(this.object)

        bbox.getCenter(center)

        return center
    }
}