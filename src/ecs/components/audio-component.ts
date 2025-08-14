import * as Tone from "tone";
import { AudioEffectComponent } from "./audio-effect-component";
import { AudioSourceComponent } from "./audio-source-component";
import { Component } from "./component";

export class AudioComponent implements Component {

    source: AudioSourceComponent

    effects: AudioEffectComponent[]

    range: number

    output: Tone.ToneAudioNode

    isConnected: boolean

    isMuted: boolean

    constructor(source: AudioSourceComponent, effects?: AudioEffectComponent[], range?:number) {

        this.source = source

        this.effects = effects

        this.range = range

        // if(effects == undefined) 
        this.output = source.output
        // else this.output = effects[effects.length-1].output

        this.isConnected = false
    }

    connect(node: Tone.ToneAudioNode) {

        this.output.connect(node)

        this.isConnected = true
    }

    disconnect(node?: Tone.ToneAudioNode) {

        if(node) this.output.disconnect(node)
        else this.output.disconnect()

        this.isConnected = false
    }
}