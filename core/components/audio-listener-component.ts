import { Component } from "./component";
import { TransformationComponent } from "./transformation-component";

export class AudioListenerComponent implements Component {

    public transform: TransformationComponent

    constructor(transform: TransformationComponent) {

        this.transform = transform
    }
}