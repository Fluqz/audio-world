import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import { Component, EComponents } from "./component";

export class TransformationComponent implements Component {

    name: EComponents

    position: Vector3
    rotation: Euler
    quaternion: Quaternion
    scale: Vector3

    // NEED MATRIX TOO!
    matrix: Matrix4

    // Graphics or Transform Component ???
    needsUpdate: boolean 

    constructor() {

        this.name = EComponents.TRANSFORMATION

        this.position = new Vector3()
        this.rotation = new Euler()
        this.quaternion = new Quaternion()
        this.scale = new Vector3(1, 1, 1)

        this.matrix = new Matrix4()

        this.needsUpdate = false
    }
}