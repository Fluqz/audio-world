import * as Tone from 'tone'

import { Component } from "../component";
import { Globals } from '../../../globals';

export class PlayerComponent implements Component {
    __componentBrand: true

    player: Tone.Player

    path:string
    loop:boolean

    output: Tone.ToneAudioNode

    constructor(path: string, loop: boolean) {

        this.path = path
        this.loop = loop
    }

    serialize() {
        return {
            path: this.path,
            loop: this.loop,
        };
    }

    initOscillator() {

        this.player = new Tone.Player(Globals.path + this.path)

        this.player.loop = this.loop

        this.player.start()
        
        this.output = this.player
    }

    destroy() {
        this.player?.stop();
        this.player?.dispose();
    }
}
