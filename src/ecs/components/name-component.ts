import { Component, ComponentData } from "./component";

export class NameComponent implements Component {
    __componentBrand: true

    name: string

    constructor(name: string) {

        this.name = name
    }

    serialize(): ComponentData {
        
        return {
            name: this.name
        }
    }
}
