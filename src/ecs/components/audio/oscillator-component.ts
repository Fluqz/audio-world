import * as Tone from 'tone'

import { ECS } from '../../ecs';
import { AudioSourceComponent } from './audio-source-component';

export class OscillatorComponent extends AudioSourceComponent {

    waveform: OscillatorType;
    frequency: Tone.Unit.Frequency;
    volume: Tone.Unit.Decibels;

    // Runtime-only:
    oscillator?: Tone.Oscillator;
    envelope: Tone.AmplitudeEnvelope

    constructor(waveform: OscillatorType, frequency: Tone.Unit.Frequency, volume: Tone.Unit.Degrees) {
        super()

        this.waveform = waveform
        this.frequency = frequency
        this.volume = volume
    }

    serialize() {
        return {
            type: this.waveform,
            frequency: this.frequency,
            volume: this.volume,
        };
    }

    resolveReferences(ecs: ECS) {

        this.oscillator = new Tone.Oscillator(this.frequency, this.waveform)

        this.oscillator.start()

        // this.envelope = new Tone.AmplitudeEnvelope(0, 1, 1, 1)
        this.volumeNode = new Tone.PanVol(0, this.volume)
        // this.gain.connect(this.volume)

        this.oscillator.connect(this.volumeNode)

        this.outputNode = this.volumeNode
    }

    destroy() {
        this.oscillator?.stop();
        this.oscillator?.dispose();

        this.volumeNode.dispose()
    }
}
