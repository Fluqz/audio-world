import * as Tone from "tone";
import { Effect, EffectOptions } from "tone/build/esm/effect/Effect";
import { Component } from "./component";

export class AudioEffectComponent implements Component {

    effect: Effect<EffectOptions>

    output: Tone.ToneAudioNode

    constructor(effect: Effect<EffectOptions>) {

        this.effect = effect

        this.output = this.effect
    }
}