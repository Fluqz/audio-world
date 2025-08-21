import { Component, ComponentData } from "./component";

export class NameComponent implements Component {
    __componentBrand: true

    name: string

    constructor(data: { name: string }) {

        this.name = data.name
    }

    serialize(): ComponentData {
        
        return {
            name: this.name
        }
    }
}
