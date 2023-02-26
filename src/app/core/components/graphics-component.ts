import { Object3D } from "three";
import { Game } from "../../game";
import { Component, EComponents } from "./component";



export class GraphicsComponent implements Component {

    name: string

    object: Object3D

    constructor(object: Object3D) {

        this.name = EComponents.GRAPHICS

        this.object = object

        this.object.traverse(o => {

            o.matrixAutoUpdate = false
        })

        Game.world.scene.add(this.object)
    }
}