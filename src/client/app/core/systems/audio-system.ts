import * as Tone from 'tone'

import { Component, EComponent } from "../components/component";
import { Entity } from "../entity";
import { System } from "./system";
import { AudioComponent } from "../components/audio-component";
import { TransformationComponent } from "../components/transformation-component";
import { M } from "../../util/math";
import { AudioListenerComponent } from "../components/audio-listener-component";
import { Game } from '../../game';
import { Utils } from '../../util/utils';
import { World } from '../world';

export class AudioSystem extends System {

    public listener: AudioListenerComponent

    private minVolume: number = -70
    private maxVolume: number = 6

    private audio: AudioComponent
    private transform: TransformationComponent

    // Master should not be in game should it?
    private get master() { return Game.master }

    get volumeRange() { return Math.abs(this.maxVolume - this.minVolume) }


    constructor(world: World, listener: AudioListenerComponent) {
        super(world)

        this.listener = listener

        this.requiredComponents = [EComponent.AUDIO, EComponent.TRANSFORMATION]
    }


    initialize() {

        this.entities = Entity.filterByComponents(this.world.entities, this.requiredComponents)

        for(let e of this.entities) {

            this.audio = e.getComponent<AudioComponent>(EComponent.AUDIO)
            this.audio.source.output.connect(this.master)
        }
    }

    fixedUpdate?(...args: any[]): void {}

    update(...args: any[]): void {

        // entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(let e of this.entities) {

            this.audio = e.getComponent<AudioComponent>(EComponent.AUDIO)
            this.transform = e.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)

            this.updatePositionalAudio(args[0])
        }
    }


    updatePositionalAudio(delta: number) : void {

        // Instead of distance to center point,
        // use distance to min max of boundingbox 
        const d = this.transform.position.distanceTo(this.listener.transform.position)

        // MUTE
        if(d > this.audio.range) {
            

            // Volume
            // if(this.audio.source.volume.volume.value == Number.NEGATIVE_INFINITY) return

            // this.audio.source.volume.volume.value = Number.NEGATIVE_INFINITY


            // Using gain instead of volume
            if(this.audio.source.gain.gain.value == 0) return

            this.audio.source.gain.gain.value = 0

        }
        else { // UNMUTE

            // Reverse Cool!
            // let volume = M.map(d, 0, this.audio.range, this.minVolume, this.maxVolume) 

            // Logarithmic
            // const r0to1 = M.map(d, 0, this.audio.range, 1, 0)
            // const volume = M.linearTologarithmic(r0to1, 0, 1, 1, this.volumeRange + 1) + this.minVolume

            // if(this.audio.source.volume.volume.value == volume) return

            // this.audio.source.volume.volume.value = volume

            // Using gain instead of volume
            let gain = M.map(d, 0, this.audio.range, 1, 0) 

            if(this.audio.source.gain.gain.value == gain) return

            this.audio.source.gain.gain.value = gain
        }

        // console.log('update', this.audio.source.volume.volume.value)
    }
}