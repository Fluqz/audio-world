import { Euler, Quaternion, Vector3 } from "three";
import { Component, EComponents } from "./component";

export class TransformationComponent implements Component {

    name: string

    position: Vector3
    rotation: Euler
    quaternion: Quaternion
    scale: Vector3

    // Graphics or Transform Component ???
    needsUpdate: boolean 

    constructor() {

        this.name = EComponents.TRANSFORMATION

        this.position = new Vector3()
        this.rotation = new Euler()
        this.quaternion = new Quaternion()
        this.scale = new Vector3(1, 1, 1)

        this.needsUpdate = false
    }
}