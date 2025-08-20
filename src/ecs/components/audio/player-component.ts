import * as Tone from 'tone'

import { Globals } from '../../../globals';
import { ECS } from '../../ecs';
import { AudioSourceComponent } from './audio-source-component';

export class PlayerComponent extends AudioSourceComponent {

    player: Tone.Player

    path:string
    loop:boolean

    volume: Tone.Unit.Decibels

    constructor(path: string, loop: boolean, volume: Tone.Unit.Decibels) {
        super()

        this.path = path
        this.loop = loop

        this.volume = volume
    }

    serialize() {
        return {
            path: this.path,
            loop: this.loop,
        };
    }

    resolveReferences(ecs: ECS) {

        this.player = new Tone.Player(Globals.path + this.path)
        this.player.loop = this.loop
        this.player.start()

        this.volumeNode = new Tone.PanVol(0, this.volume)

        this.player.connect(this.volumeNode)
        
        this.outputNode = this.volumeNode
    }

    destroy() {
        this.player?.stop();
        this.player?.dispose();

        this.volumeNode.dispose()
    }
}
