import * as Tone from 'tone'

import { Component, EComponents } from "../components/component";
import { Entity } from "../entity";
import { System } from "./system";
import { AudioComponent } from "../components/audio-component";
import { TransformationComponent } from "../components/transformation-component";
import { M } from "../../util/math";
import { AudioListenerComponent } from "../components/audio-listener-component";
import { Game } from '../../game';
import { Utils } from '../../util/utils';

export class AudioSystem implements System {

    public listener: AudioListenerComponent

    private minVolume: number = -45
    private maxVolume: number = 3

    constructor(listener: AudioListenerComponent) {

        this.listener = listener
    }

    requiredComponents: EComponents[] = [EComponents.AUDIO, EComponents.TRANSFORMATION]

    private audio: AudioComponent
    private transform: TransformationComponent

    // Master should not be in game should it?
    private get master() { return Game.master }

    process(entities: Entity[], ...args: any[]): void {

        entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(let e of entities) {

            this.audio = e.getComponent(EComponents.AUDIO) as AudioComponent
            this.audio.source.output.connect(this.master)
            // this.audio.output.connect(this.master)
            this.transform = e.getComponent(EComponents.TRANSFORMATION) as TransformationComponent

            this.update(args[0])
        }
    }


    update(delta: number) : void {

        // Instead of distance to center point,
        // use distance to min max of boundingbox 
        const d = this.transform.position.distanceTo(this.listener.transform.position)
        
        // MUTE
        if(d > this.audio.range) {
            
            // if(this.audio.source.volume.volume.value == 0) return
            this.audio.source.volume.volume.exponentialRampToValueAtTime(this.minVolume, Tone.context.currentTime)
            console.log('update mute',this.audio.source.volume.volume.value == this.minVolume)
            // this.audio.source.volume.mute = true
        }
        else { // UNMUTE

            let log = Math.log10(d)
            let volume = M.map(d, 0, this.audio.range, 3, -30)
            // let volume = M.map(d, 0, this.audio.range, 1, 0)

            this.audio.source.volume.mute = false

            // if(this.audio.source.volume.volume.value == volume) return
            this.audio.source.volume.volume.setValueAtTime(volume, Tone.context.currentTime)
            console.log('update unmute',this.audio.source.volume.volume.value, volume, log)
        }

        console.log('update', this.audio.source.volume.volume.value)
    }
}