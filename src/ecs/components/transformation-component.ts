import { Euler, Quaternion, Vector3 } from "three";
import { Component, ComponentData } from "./component";

export class TransformationComponent implements Component {
    __componentBrand: true

    position: Vector3
    rotation: Euler
    quaternion: Quaternion
    scale: Vector3

    useQuaternion: boolean = false

    constructor(data?: { position: [number, number, number], rotation: [number, number, number], quaternion: [number, number, number, number], scale: [number, number, number] }) {

        this.position = new Vector3()
        this.rotation = new Euler()
        this.quaternion = new Quaternion()
        this.scale = new Vector3(1, 1, 1)

        if(data) {

            this.position.fromArray(data.position)
            this.rotation.fromArray(data.rotation)
            this.quaternion.fromArray(data.quaternion)
            this.scale.fromArray(data.scale)
        }
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