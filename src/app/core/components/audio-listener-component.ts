import { Component, EComponents } from "./component";

export class AudioListenerComponent implements Component {

    name: string

    constructor() {

        this.name = EComponents.AUDIO_LISTENER
    }
}