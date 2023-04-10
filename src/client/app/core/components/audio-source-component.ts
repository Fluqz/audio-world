import * as Tone from "tone";
import { Source, SourceOptions } from "tone/build/esm/source/Source";
import { Component, EComponents } from "./component";

export class AudioSourceComponent implements Component {

    name: EComponents

    source: Source<SourceOptions>
    envelope: Tone.AmplitudeEnvelope
    volume: Tone.Volume
    gain: Tone.Gain

    output: Tone.ToneAudioNode

    constructor(source: Source<SourceOptions>, gain: number, volume: number) {

        this.name = EComponents.AUDIO

        this.source = source
        this.source.start()

        this.gain = new Tone.Gain(gain)
        this.source.connect(this.gain)
        
        // this.envelope = new Tone.AmplitudeEnvelope(0, 1, 1, 1)
        this.volume = new Tone.Volume(volume)
        this.gain.connect(this.volume)
        
        this.output = this.volume
    }
}