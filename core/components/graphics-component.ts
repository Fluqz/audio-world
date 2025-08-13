import { Box3, Object3D, Vector3 } from "three";
import { Component } from "./component";
import { Game } from "../../src/game/game";


export class GraphicsComponent implements Component {

    object: Object3D

    constructor(object: Object3D) {

        this.object = object

        this.object.traverse(o => {

            o.matrixAutoUpdate = false
        })

        Game.i.manager.scene.add(this.object)
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