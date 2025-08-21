import { Component, ComponentData } from "./component";

export class TagComponent implements Component {
    __componentBrand: true

    tagName: string

    constructor(data: { tagName: string }) {

        this.tagName = data.tagName
    }

    serialize(): ComponentData {
        
        return {
            tagName: this.tagName
        }
    }
}
