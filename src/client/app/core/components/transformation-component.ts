import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import { Component, EComponent } from "./component";

export class TransformationComponent implements Component {

    name: EComponent

    position: Vector3
    rotation: Euler
    quaternion: Quaternion
    scale: Vector3

    // NEED MATRIX TOO!
    // matrix: Matrix4

    // Graphics or Transform Component ???
    needsUpdate: boolean 

    constructor(position?: Vector3, rotation?: Euler, quaternion?: Quaternion, scale?: Vector3) {

        this.name = EComponent.TRANSFORMATION

        this.position = position == undefined ? new Vector3() : position
        this.rotation = rotation == undefined ? new Euler() : rotation
        this.quaternion = quaternion == undefined ? new Quaternion() : quaternion
        this.scale = scale == undefined ? new Vector3(1, 1, 1) : scale

        // this.matrix = new Matrix4().setPosition(this.position)
        // this.matrix = new Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z)
        // this.matrix = new Matrix4().makeRotationFromQuaternion(this.quaternion)
        // this.matrix = new Matrix4().makeRotationFromEuler(this.rotation)

        this.needsUpdate = false
    }
}