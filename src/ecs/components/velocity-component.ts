import { Vector3 } from "three";
import { Component } from "./component";

export class VelocityComponent implements Component {
    __componentBrand: true

    velocity = new Vector3()
}