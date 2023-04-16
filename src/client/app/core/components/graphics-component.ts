import { Object3D } from "three";
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
}