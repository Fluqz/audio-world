import { Vector3 } from "three";
import { Component } from "./component";

export class VelocityComponent implements Component {
    __componentBrand: true

    /** Velocity in all 3 directions. */
    velocity = new Vector3()
}