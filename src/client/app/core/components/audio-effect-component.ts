import * as Tone from "tone";
import { Effect, EffectOptions } from "tone/build/esm/effect/Effect";
import { Source, SourceOptions } from "tone/build/esm/source/Source";
import { Game } from "../../game";
import { M } from "../../util/math";
import { AudioListenerComponent } from "./audio-listener-component";
import { Component, EComponent } from "./component";

export class AudioEffectComponent implements Component {

    name: EComponent

    effect: Effect<EffectOptions>

    output: Tone.ToneAudioNode

    constructor(effect: Effect<EffectOptions>) {

        this.name = EComponent.AUDIO

        this.effect = effect

        this.output = this.effect
    }
}