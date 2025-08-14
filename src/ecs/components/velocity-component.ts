import { Vector3 } from "three";
import { Component } from "./component";

export class VelocityComponent implements Component {

    velocity: Vector3

    constructor(velocity?: Vector3) {

        this.velocity = velocity == undefined ? new Vector3() : velocity
    }
}