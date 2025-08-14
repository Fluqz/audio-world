import { Euler, Quaternion, Vector3 } from "three";
import { Component, ComponentData } from "./component";

export class TransformationComponent implements Component {
    __componentBrand: true

    position: Vector3
    rotation: Euler
    quaternion: Quaternion
    scale: Vector3

    // NEED MATRIX TOO!
    // matrix: Matrix4

    // Graphics or Transform Component ???
    needsUpdate: boolean 

    eulerOverQuaternions: boolean = false

    constructor(position?: [number, number, number], rotation?: [number, number, number], quaternion?: [number, number, number, number], scale?: [number, number, number]) {

        this.position = position == undefined ? new Vector3() : new Vector3().fromArray(position)
        this.rotation = rotation == undefined ? new Euler() : new Euler().fromArray(rotation)
        this.quaternion = quaternion == undefined ? new Quaternion() : new Quaternion().fromArray(quaternion)
        this.scale = scale == undefined ? new Vector3(1, 1, 1) : new Vector3().fromArray(scale)

        this.needsUpdate = false
    }

    serialize(): ComponentData {
        
        return {
            position: this.position.toArray(),
            rotation: this.rotation.toArray(),
            quaternion: this.quaternion.toArray(),
            scale: this.scale.toArray(),
        }
    }
}