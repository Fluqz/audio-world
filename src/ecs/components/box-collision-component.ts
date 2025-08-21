import { Vector3 } from "three"
import { Component, ComponentData } from "./component"



export class BoxCollisionComponent implements Component {
    __componentBrand: true

    w: number
    h: number
    d: number

    position = new Vector3()

    constructor(data: { w:number, h:number, d:number, position: [number, number, number] }) {

        this.w = data.w
        this.h = data.h
        this.d = data.d

        this.position.fromArray(data.position)
    }

    serialize(): ComponentData {

        return {
            w: this.w,
            h: this.h,
            d: this.d,
            position: this.position.toArray()
        }
    }
}