import { Component, EComponents } from "./component";
import { TransformationComponent } from "./transformation-component";

export class AudioListenerComponent implements Component {

    name: EComponents

    public transform: TransformationComponent

    constructor(transform: TransformationComponent) {

        this.name = EComponents.AUDIO_LISTENER

        this.transform = transform
    }
}