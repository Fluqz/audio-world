import { Box3, Object3D, Vector3 } from "three";
import { Game } from "../../game";
import { Component, EComponent } from "./component";



export class GraphicsComponent implements Component {

    name: EComponent

    object: Object3D

    constructor(object: Object3D) {

        this.name = EComponent.GRAPHICS

        this.object = object

        this.object.traverse(o => {

            o.matrixAutoUpdate = false
        })

        Game.world.scene.add(this.object)
    }


    getSize() {

        const bbox = new Box3()
        bbox.setFromObject(this.object)

        const size = new Vector3()
        bbox.getSize(size)

        return size
    }

    getCenter() {

        const bbox = new Box3()
        bbox.setFromObject(this.object)

        const center = new Vector3()
        bbox.getCenter(center)

        return center
    }
}