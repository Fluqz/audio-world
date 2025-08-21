import * as Tone from 'tone'

import { Component } from "../component";

export abstract class AudioSourceComponent implements Component {
    __componentBrand: true

    source: Tone.ToneAudioNode

    volumeNode: Tone.PanVol

    outputNode: Tone.ToneAudioNode

    isMuted:boolean = false
}
