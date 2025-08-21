import * as Tone from 'tone'

import { Component } from "../component";

export abstract class AudioSourceComponent implements Component {
    __componentBrand: true

    source: Tone.ToneAudioNode

    volumeNode: Tone.Volume

    panner: Tone.Panner3D

    outputNode: Tone.ToneAudioNode

    isMuted:boolean = false

    isConnected: boolean = false

    connect(node: Tone.ToneAudioNode) {

        if(this.outputNode == undefined) return false

        if(this.isConnected) {

            this.outputNode.disconnect()
            this.isConnected = false
        }

        this.outputNode.connect(node)

        this.isConnected = true
    }

    disconnect(node?: Tone.ToneAudioNode) {

        if(this.outputNode == undefined) return false

        this.outputNode.disconnect(node)

        this.isConnected = false
    }
}
