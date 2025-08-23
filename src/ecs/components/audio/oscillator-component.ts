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

    constructor(data: { waveform: OscillatorType, frequency: Tone.Unit.Frequency, volume: Tone.Unit.Degrees }) {
        super()

        this.waveform = data.waveform
        this.frequency = data.frequency
        this.volume = data.volume
    }

    serialize() {
        return {
            waveform: this.waveform,
            frequency: this.frequency,
            volume: this.volume,
        };
    }

    resolveReferences(ecs: ECS) {

        this.oscillator = new Tone.Oscillator(this.frequency, this.waveform)

        this.oscillator.start()

        // this.envelope = new Tone.AmplitudeEnvelope(0, 1, 1, 1)
        // this.volumeNode = new Tone.Volume(this.volume)

        // Create a 3D panner
        this.panner = new Tone.Panner3D({
            panningModel: "HRTF",   // more realistic
            distanceModel: "exponential", // controls volume falloff
            maxDistance: 100,
            rolloffFactor: 1, //.8,
        })

        this.oscillator.connect(this.panner)
        // this.panner.connect(this.volumeNode)

        this.outputNode = this.panner
    }

    destroy() {
        this.oscillator?.stop();
        this.oscillator?.dispose();

        this.volumeNode.dispose()
    }
}
