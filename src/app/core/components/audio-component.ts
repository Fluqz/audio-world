import * as Tone from "tone";
import { Game } from "../../game";
import { M } from "../../util/math";
import { AudioListenerComponent } from "./audio-listener-component";
import { Component, EComponents } from "./component";

export class AudioComponent implements Component {

    name: string

    frequency: number = 400
    range: number = 30
    wave: OscillatorType

    oscillator: Tone.Oscillator
    envelope: Tone.AmplitudeEnvelope
    gain: Tone.Gain

    constructor(frequency: number, wave: OscillatorType, range: number) {

        this.name = EComponents.AUDIO

        this.frequency = frequency
        this.range = range
        this.wave = wave

        this.oscillator = new Tone.Oscillator(this.frequency)
        this.oscillator.type = wave

        // this.envelope = new Tone.AmplitudeEnvelope(0, 1, 1, 1)
        this.gain = new Tone.Gain(.1)
        this.oscillator.connect(this.gain)
        this.gain.connect(Game.master)
        this.oscillator.start()

    }



//     destruct() {

//         this.stop(Tone.context.currentTime)
//         this.gain.disconnect()
//         this.oscillator.disconnect()
//         this.gain.dispose()
//         this.oscillator.dispose()
//     }
}