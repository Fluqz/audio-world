import { GraphicsComponent } from "../components/graphics-component"
import { Component, EComponents } from "../components/component";
import { Entity } from "../entity";
import { System } from "./system";
import { AudioComponent } from "../components/audio-component";
import { TransformationComponent } from "../components/transformation-component";
import { M } from "../../util/math";

export class AudioSystem implements System {

    requiredComponents: EComponents[] = [EComponents.AUDIO, EComponents.TRANSFORMATION]

    private audio: AudioComponent
    private transform: TransformationComponent

    process(entities: Entity[], ...args: any[]): void {

        let process: boolean
        for(let e of entities) {

            process = true

            for(let c of this.requiredComponents) {
                
                if(!e.getComponent(c)) {

                    process = false
                }
            }
                        
            if(!process) continue

            this.audio = e.getComponent(EComponents.AUDIO) as AudioComponent
            this.transform = e.getComponent(EComponents.TRANSFORMATION) as TransformationComponent
        }
    }


    update(delta: number) : void {

        // if(this.listener)

        // const d = this.transform.position.distanceTo(this.listener.transform.position)

        // if(d > this.audio.range) {
        
        //     if(this.audio.gain.gain.value == 0) return
        //     this.audio.gain.gain.setValueAtTime(0, delta)
        // }
        // else {

        //     let gain = M.map(d, 0, this.audio.range, .7, 0)
        //     if(this.audio.gain.gain.value == gain) return
        //     this.audio.gain.gain.setValueAtTime(gain, delta)
        // }
    }
}