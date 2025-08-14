import { System } from "./system";
import { AudioComponent } from "../components/audio-component";
import { TransformationComponent } from "../components/transformation-component";
import { AudioListenerComponent } from "../components/audio-listener-component";
import { ECS } from '../ecs';
import { Game } from "../../client/game";
import * as Tone  from "tone";
import { Octree } from "../octree";

export class AudioSystem extends System {

    public octree: Octree
    public listener: AudioListenerComponent

    public static mindB: number = -80
    public static maxdB: number = 0

    // Master should not be in game should it?
    private get master() { return Game.master }

    get volumeRange() { return Math.abs(AudioSystem.maxdB - AudioSystem.mindB) }


    constructor(octree: Octree, listener: AudioListenerComponent) {
        super()

        this.listener = listener
    }

    update(ecs: ECS, delta: number): void {

        // entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(let [e, [audio, transform]] of ecs.queryEntities(AudioComponent, TransformationComponent)) {

            // Instead of distance to center point,
            // use distance to min max of boundingbox 
            const distance = transform.position.distanceTo(this.listener.transform.position)

            this.updatePositionalAudio(distance, audio)
        }
    }

    updatePositionalAudio(distance: number, audio: AudioComponent) : void {

        // MUTE
        if(distance > audio.range) {
            
            if(audio.isConnected) {

                audio.source.volume.volume.value = AudioSystem.mindB
            }   

            audio.isMuted = true

            if(audio.source.volume.volume.value == AudioSystem.mindB) return

            audio.source.volume.volume.value = AudioSystem.mindB

        }
        else { // UNMUTE

            if(audio.isConnected == false) audio.connect(this.master)
            // // Reverse Cool!
            // let volume = M.map(d, 0, this.audio.range, this.mindB, this.maxdB) 

            let volume = this.distanceTodB(distance, .01, audio.range, -50, AudioSystem.maxdB)

            audio.isMuted = false

            if(audio.source.volume.volume.value == volume) return

            audio.source.volume.volume.setValueAtTime(volume, Tone.now())
        }
    }

    public distanceTodB(distance: number, minDistance: number = .1, maxDistance: number = 50.0, mindB: number = -80.0, maxdB: number = 0.0): number {

        if (distance <= minDistance) return maxdB  // Full volume
        if (distance >= maxDistance) return mindB  // Silent

        const t = (distance - minDistance) / (maxDistance - minDistance)  // Normalized [0, 1]
        return (1 - t) * (maxdB - mindB) + mindB  // Linearly interpolate dB
    }
}