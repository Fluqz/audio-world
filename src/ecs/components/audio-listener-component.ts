import { Component, ComponentData } from "./component";
import { TransformationComponent } from "./transformation-component";

export class AudioListenerComponent implements Component {
    __componentBrand: true

    public transform: TransformationComponent

    constructor(transform: TransformationComponent) {

        this.transform = transform
    }


    serialize(): ComponentData {
        
        return {
            TransformationComponent: this.transform.serialize()
        }
    }
}