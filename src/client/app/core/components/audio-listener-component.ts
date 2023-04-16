import { Component, EComponent } from "./component";
import { TransformationComponent } from "./transformation-component";

export class AudioListenerComponent implements Component {

    name: EComponent

    public transform: TransformationComponent

    constructor(transform: TransformationComponent) {

        this.name = EComponent.AUDIO_LISTENER

        this.transform = transform
    }
}