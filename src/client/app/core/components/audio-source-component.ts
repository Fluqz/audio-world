import * as Tone from "tone";
import { Source, SourceOptions } from "tone/build/esm/source/Source";
import { Component, EComponent } from "./component";

export class AudioSourceComponent implements Component {

    name: EComponent

    source: Source<SourceOptions>
    envelope: Tone.AmplitudeEnvelope
    volume: Tone.Volume
    gain: Tone.Gain

    output: Tone.ToneAudioNode

    /**
     * 
     * @param source Tone.Source child class instance
     * @param gain Gain level 0 to 1
     * @param volume Volume output -100 to 3
     */
    constructor(source: Source<SourceOptions>, gain: number, volume: number) {

        this.name = EComponent.AUDIO

        this.source = source

        if(this.source instanceof Tone.Player) this.source.autostart = true
        else this.source.start()

        // this.gain = new Tone.Gain(gain)
        // this.source.connect(this.gain)
        
        // this.envelope = new Tone.AmplitudeEnvelope(0, 1, 1, 1)
        this.volume = new Tone.Volume(volume)
        // this.gain.connect(this.volume)

        this.source.connect(this.volume)
        
        this.output = this.volume
    }
}