import { Object3D, Vector3 } from "three";
import { Game } from "../../game";
import { Component, EComponent } from "./component";


export class BoundingboxComponent implements Component {

    name: EComponent

    center: Vector3

    dimensions: Vector3

    min: Vector3

    max: Vector3


    constructor(center: Vector3, dimensions: Vector3) {

        this.name = EComponent.BOUNDINGBOX

        this.center = center
        this.dimensions = dimensions

        this.min = new Vector3()
        this.max = new Vector3()

        this.min.x = center.x - dimensions.x / 2
        this.min.y = center.y - dimensions.y / 2
        this.min.z = center.z - dimensions.z / 2

        this.max.x = center.x + dimensions.x / 2
        this.max.y = center.y + dimensions.y / 2
        this.max.z = center.z + dimensions.z / 2
    }

    getCorner(x:number = 1 | -1, y:number = 1 | -1, z:number = 1 | -1) {

        return new Vector3(
            this.center.x + ((this.dimensions.x / 2) * x),
            this.center.y + ((this.dimensions.y / 2) * y),
            this.center.z + ((this.dimensions.z / 2) * z)
        )
    }
}