import { System } from "./system";
import { TransformationComponent } from "../components/transformation-component";
import { ECS } from '../ecs';
import { Game } from "../../client/game";
import * as Tone  from "tone";
import { Octree } from "../octree";
import { OscillatorComponent } from "../components/audio/oscillator-component";
import { AudibleRadiusComponent } from "../components/audio/audible-radius-component";
import { Entity } from "../entity";
import { AudioSourceComponent } from "../components/audio/audio-source-component";
import { PlayerComponent } from "../components/audio/player-component";

export class AudioSystem extends System {

    public octree: Octree

    public static mindB: number = -80
    public static maxdB: number = 0

    // Master should not be in game should it?
    private get master() { return Game.master }


    constructor(octree: Octree) {
        super()
    }

    update(ecs: ECS, dt: number): void {

        for (const [e, [transform, audible]] of ecs.queryEntities(TransformationComponent, AudibleRadiusComponent)) {

            let source: AudioSourceComponent = ecs.getComponent(e, OscillatorComponent) as OscillatorComponent
            if(source == undefined) source = ecs.getComponent(e, PlayerComponent) as PlayerComponent
            if(source == undefined) continue

            if(source.isConnected == false) source.connect(this.master)

            source.panner.maxDistance = audible.radius

            // Update the audio source position
            source.panner.setPosition(transform.position.x, 1, transform.position.z)
        }
    }

    // update(ecs: ECS, delta: number): void {

    //     const player = ecs.getTaggedEntity('player')?.[0]

    //     if(!player) return

    //     const playerTransform = ecs.getComponent(player, TransformationComponent)

    //     if(playerTransform == undefined) {

    //         console.error('AudioSystem - playerTransform is undefined', player, playerTransform)

    //         return
    //     }

    //     // entities = Entity.filterByComponents(entities, this.requiredComponents)

    //     for(let [e, [transform, audible]] of ecs.queryEntities(TransformationComponent, AudibleRadiusComponent)) {

    //         let source: AudioSourceComponent = ecs.getComponent(e, OscillatorComponent) as OscillatorComponent
    //         if(source == undefined) source = ecs.getComponent(e, PlayerComponent) as PlayerComponent
    //         if(source == undefined) continue

    //         if(source.outputNode) source.outputNode.connect(this.master)

    //         // Instead of distance to center point,
    //         // use distance to min max of boundingbox 
    //         const distance = transform.position.distanceTo(playerTransform.position)

    //         // console.log('audio ',distance)
    //         this.updatePositionalAudio(source, distance, audible.radius)
    //     }
    // }

    updatePositionalAudio(audio: AudioSourceComponent, distance: number, radius: number) : void {

        // MUTE
        if(distance > radius) {
            
            audio.isMuted = true

            if(audio.volumeNode.volume.value == AudioSystem.mindB) return

            audio.volumeNode.volume.value = AudioSystem.mindB

        }
        else { // UNMUTE

            // // Reverse Cool!
            // let volume = M.map(d, 0, this.audio.range, this.mindB, this.maxdB) 

            let volume = this.distanceTodB(distance, .01, radius, -50, AudioSystem.maxdB)

            audio.isMuted = false

            if(audio.volumeNode.volume.value == volume) return

            audio.volumeNode.volume.setValueAtTime(volume, Tone.now())
        }
    }

    /** Sound pressure level */
    public distanceTodB(distance: number, minDistance: number = .1, maxDistance: number = 50.0, mindB: number = -80.0, maxdB: number = 0.0): number {

        if (distance <= minDistance) return maxdB  // Full volume
        if (distance >= maxDistance) return mindB  // Silent

        const t = (distance - minDistance) / (maxDistance - minDistance)  // Normalized [0, 1]
        return (1 - t) * (maxdB - mindB) + mindB  // Linearly interpolate dB
    }
}