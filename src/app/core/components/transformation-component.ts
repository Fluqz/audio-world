import { Quaternion, Vector3 } from "three";
import { Component } from "./i-component";

export class TransformationComponent implements Component {

    name: string

    position: Vector3
    rotation: Vector3
    quaternion: Quaternion
    scale: Vector3
}