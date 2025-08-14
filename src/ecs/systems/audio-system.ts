import { System } from "./system";
import { AudioComponent } from "../components/audio-component";
import { TransformationComponent } from "../components/transformation-component";
import { AudioListenerComponent } from "../components/audio-listener-component";
import { ECS } from '../ecs';
import { Game } from "../../game/game";
import { Entity } from "../entity";
import * as Tone  from "tone";

export class AudioSystem extends System {

    public listener: AudioListenerComponent

    private mindB: number = -80
    private maxdB: number = 0

    // Master should not be in game should it?
    private get master() { return Game.master }

    get volumeRange() { return Math.abs(this.maxdB - this.mindB) }


    constructor(listener: AudioListenerComponent) {
        super()

        this.listener = listener
    }

    update(ecs: ECS, delta: number): void {

        // entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(let [e, [audio, transform]] of ecs.queryEntities(AudioComponent, TransformationComponent)) {


            this.updatePositionalAudio(e, audio, transform)
        }
    }


    updatePositionalAudio(e: Entity, audio: AudioComponent, transform: TransformationComponent) : void {

        // Instead of distance to center point,
        // use distance to min max of boundingbox 
        const distance = transform.position.distanceTo(this.listener.transform.position)

        // MUTE
        if(distance > audio.range) {
            
            // Volume
            // if(audio.source.volume.volume.value == Number.NEGATIVE_INFINITY) return

            // audio.source.volume.volume.value = Number.NEGATIVE_INFINITY

            if(audio.connected) {

                audio.source.volume.volume.value = this.mindB
                // audio.disconnect()
            }   

            if(audio.source.volume.volume.value == this.mindB) return

            // Using gain instead of volume
            // if(audio.source.gain.gain.value == 0) return

            // audio.source.gain.gain.value = 0
            audio.source.volume.volume.value = this.mindB

        }
        else { // UNMUTE

            if(audio.connected == false) audio.connect(this.master)
            // // Reverse Cool!
            // let volume = M.map(d, 0, this.audio.range, this.mindB, this.maxdB) 

            let volume = this.distanceTodB(distance, .01, audio.range, -50, this.maxdB)

            // Using gain instead of volume
            // let gain = M.map(d, 0, this.audio.range, 1, 0)

            // if(this.audio.source.gain.gain.value == gain) return
            if(audio.source.volume.volume.value == volume) return

            // audio.source.gain.gain.value = gain
            audio.source.volume.volume.setValueAtTime(volume, Tone.now())
        }
    }

    public distanceTodB(distance: number, minDistance: number = .1, maxDistance: number = 50.0, mindB: number = -80.0, maxdB: number = 0.0): number {

        if (distance <= minDistance) return maxdB;           // Full volume
        if (distance >= maxDistance) return mindB;  // Silent

        const t = (distance - minDistance) / (maxDistance - minDistance); // Normalized [0, 1]
        return (1 - t) * (maxdB - mindB) + mindB;       // Linearly interpolate dB
    }
}