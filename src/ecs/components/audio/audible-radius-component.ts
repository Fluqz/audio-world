import { Component, ComponentData } from "../component";



export class AudibleRadiusComponent implements Component {
    __componentBrand: true

    radius: number

    constructor(radius: number) {

        this.radius = radius
    }

    serialize(): ComponentData {
        
        return {
            radius: this.radius
        }
    }
}