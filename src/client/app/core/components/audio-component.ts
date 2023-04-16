import * as Tone from "tone";
import { AudioEffectComponent } from "./audio-effect-component";
import { AudioSourceComponent } from "./audio-source-component";
import { Component, EComponent } from "./component";

export class AudioComponent implements Component {

    name: EComponent

    source: AudioSourceComponent

    effects: AudioEffectComponent[]

    range: number

    output: Tone.ToneAudioNode

    constructor(source: AudioSourceComponent, effects?: AudioEffectComponent[], range?:number) {

        this.name = EComponent.AUDIO

        this.source = source

        this.effects = effects

        this.range = range

        // if(effects == undefined) 
        this.output = source.output
        // else this.output = effects[effects.length-1].output
    }
}