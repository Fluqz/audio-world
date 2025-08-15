import * as Tone from 'tone'

import { Component } from "../component";

export class OscillatorComponent implements Component {
    __componentBrand: true

    waveform: OscillatorType;
    frequency: number;
    volume: number;

    // Runtime-only:
    oscillator?: Tone.Oscillator;
    envelope: Tone.AmplitudeEnvelope
    volumeNode: Tone.Volume

    isMuted:boolean = false

    constructor(waveform: OscillatorType, frequency: number, volume: number) {
        this.waveform = waveform ?? "sine";
        this.frequency = frequency ?? 440;
        this.volume = volume ?? -10;
    }

    serialize() {
        return {
            type: this.waveform,
            frequency: this.frequency,
            volume: this.volume
        };
    }

    initOscillator(master: Tone.Volume) {

        this.oscillator = new Tone.Oscillator(this.frequency, this.waveform)
        
        // this.envelope = new Tone.AmplitudeEnvelope(0, 1, 1, 1)
        this.volumeNode = new Tone.Volume(this.volume)
        // this.gain.connect(this.volume)

        this.oscillator.connect(this.volumeNode)

        this.volumeNode.connect(master)
    }

    destroy() {
        this.oscillator?.stop();
        this.oscillator?.dispose();
    }
}
