import * as Tone from "tone";
import { Game } from "../../game";
import { M } from "../../util/math";
import { AudioListenerComponent } from "./audio-listener-component";
import { Component } from "./i-component";




export class AudioComponent implements Component {

    name: string

    listener: AudioListenerComponent
    frequency: number = 400
    range: number = 30

    oscillator: Tone.Oscillator
    envelope: Tone.AmplitudeEnvelope
    gain: Tone.Gain

    constructor(object: GameObject, listener: AudioListenerComponent, frequency: number, range: number) {

        super()

        this.object = object
        this.listener = listener
        this.frequency = frequency
        this.range = range
    }

    construct(): void {
        
        this.oscillator = new Tone.Oscillator(this.frequency)
        this.oscillator.type = ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType

        // this.envelope = new Tone.AmplitudeEnvelope(0, 1, 1, 1)
        this.gain = new Tone.Gain(0)
        this.oscillator.connect(this.gain)
        this.gain.connect(Game.master)

        this.start(Tone.context.currentTime)
    }

    start(delta: number) : void {

        this.oscillator.start(delta)
    }

    update(delta: number) : void {

        const d = this.object.position.distanceTo(this.listener.object.position)

        if(d > this.range) {
        
            if(this.gain.gain.value == 0) return
            this.gain.gain.setValueAtTime(0, delta)
        }
        else {

            let gain = M.map(d, 0, this.range, .7, 0)
            if(this.gain.gain.value == gain) return
            this.gain.gain.setValueAtTime(gain, delta)
        }
    }
    
    stop(delta: number) : void {

        this.oscillator.stop(delta)
    }

    destruct() {

        this.stop(Tone.context.currentTime)
        this.gain.disconnect()
        this.oscillator.disconnect()
        this.gain.dispose()
        this.oscillator.dispose()
    }
}