import * as Tone from 'tone'

import { Globals } from '../../../globals';
import { ECS } from '../../ecs';
import { AudioSourceComponent } from './audio-source-component';

export class PlayerComponent extends AudioSourceComponent {

    player: Tone.Player

    path:string
    loop:boolean

    volume: Tone.Unit.Decibels

    constructor(data: {path: string, loop: boolean}) {
        super()

        this.path = data.path
        this.loop = data.loop
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
        this.player.autostart = true

        // Create a 3D panner
        this.panner = new Tone.Panner3D({
            panningModel: "HRTF",   // more realistic
            distanceModel: "exponential", // controls volume falloff
            maxDistance: 100,
            rolloffFactor: 1.3,
        })

        this.player.connect(this.panner)
        // this.panner.connect(this.volumeNode)

        this.outputNode = this.panner
    }

    destroy() {
        this.player?.stop();
        this.player?.dispose();

        this.volumeNode.dispose()
    }
}
