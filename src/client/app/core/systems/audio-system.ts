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

    private mindB: number = -80
    private maxdB: number = 0

    private audio: AudioComponent
    private transform: TransformationComponent

    // Master should not be in game should it?
    private get master() { return Game.master }

    get volumeRange() { return Math.abs(this.maxdB - this.mindB) }


    constructor(world: World, listener: AudioListenerComponent) {
        super(world)

        this.listener = listener

        this.requiredComponents = [EComponent.AUDIO, EComponent.TRANSFORMATION]
    }


    initialize() {

        this.filterRelevantEntities()

        for(let e of this.entities) {

            this.audio = e.getComponent<AudioComponent>(EComponent.AUDIO)

            if(!this.audio.connected) this.audio.connect(this.master)

            this.audio.connected = true
        }
    }

    fixedUpdate?(...args: any[]): void {}

    update(delta: number): void {

        // entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(let e of this.entities) {

            this.audio = e.getComponent<AudioComponent>(EComponent.AUDIO)
            this.transform = e.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)

            this.updatePositionalAudio(delta)
        }
    }


    updatePositionalAudio(delta: number) : void {

        // Instead of distance to center point,
        // use distance to min max of boundingbox 
        const distance = this.transform.position.distanceTo(this.listener.transform.position)

        // MUTE
        if(distance > this.audio.range) {
            

            // Volume
            // if(this.audio.source.volume.volume.value == Number.NEGATIVE_INFINITY) return

            // this.audio.source.volume.volume.value = Number.NEGATIVE_INFINITY

            if(this.audio.connected) {

                this.audio.source.volume.volume.value = this.mindB
                // this.audio.disconnect()
            }   

            if(this.audio.source.volume.volume.value == 0) return

            // Using gain instead of volume
            // if(this.audio.source.gain.gain.value == 0) return

            // this.audio.source.gain.gain.value = 0
            this.audio.source.volume.volume.value = this.mindB


        }
        else { // UNMUTE

            // if(this.audio.connected == false) this.audio.connect(this.master)

            // // Reverse Cool!
            // let volume = M.map(d, 0, this.audio.range, this.mindB, this.maxdB) 

            let volume = this.distanceTodB(distance, .01, this.audio.range, -50, this.maxdB)

            // Using gain instead of volume
            // let gain = M.map(d, 0, this.audio.range, 1, 0)

            // if(this.audio.source.gain.gain.value == gain) return
            if(this.audio.source.volume.volume.value == volume) return

            // this.audio.source.gain.gain.value = gain
            this.audio.source.volume.volume.value = volume

        }

        // console.log('update', this.audio.source.volume.volume.value)
    }

    public distanceTodB(distance: number, minDistance: number = .1, maxDistance: number = 50.0, mindB: number = -80.0, maxdB: number = 0.0): number {

        if (distance <= minDistance) return maxdB;           // Full volume
        if (distance >= maxDistance) return mindB;  // Silent

        const t = (distance - minDistance) / (maxDistance - minDistance); // Normalized [0, 1]
        return (1 - t) * (maxdB - mindB) + mindB;       // Linearly interpolate dB
    }

    // bb() {


    //         const referenceDistance = 1   // in meters
    //         const referenceSPL = 90       // Sound Preasure level in dB at 1m
    //         const maxDistance = this.audio.range
    //         const currentSPL = referenceSPL - (20 * Math.log10(distance / referenceDistance))

    //         // Scale the volume according to distance
    //         const distanceFactor = Math.min(distance / maxDistance, 1);  // Clamping to maxDistance (30m)
    //         const volumeDrop = (this.maxdB - this.mindB) * distanceFactor;

    //         // Apply the SPL value to adjust the final volume
    //         let toneJSVolume = this.maxdB - volumeDrop;

    //         // Now adjust the volume based on the SPL at the current distance
    //         toneJSVolume -= (currentSPL - 90);  // Assuming 90 dB at 1 meter as reference (adjust as needed)

    //         // Ensure the volume doesn't go below -80 dB
    //         toneJSVolume = Math.min(Math.max(toneJSVolume, this.mindB), this.maxdB);

    // }
}