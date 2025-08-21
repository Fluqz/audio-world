import { Component, ComponentData } from "../component";



export class AudibleRadiusComponent implements Component {
    __componentBrand: true

    radius: number

    constructor(data: { radius: number }) {

        this.radius = data.radius
    }

    serialize(): ComponentData {
        
        return {
            radius: this.radius
        }
    }
}