import { GraphicsComponent } from "../components/graphics-component"
import { Component, EComponents } from "../components/component";
import { Entity } from "../entity";
import { System } from "./system";
import { AudioComponent } from "../components/audio-component";
import { TransformationComponent } from "../components/transformation-component";
import { M } from "../../util/math";
import { AudioListenerComponent } from "../components/audio-listener-component";

export class AudioSystem implements System {

    requiredComponents: EComponents[] = [EComponents.AUDIO, EComponents.TRANSFORMATION]

    private audio: AudioComponent
    private transform: TransformationComponent
    private listener: AudioListenerComponent

    process(entities: Entity[], ...args: any[]): void {

        for(let e of entities) {

            this.listener = e.getComponent(EComponents.AUDIO_LISTENER) as AudioListenerComponent

            if(this.listener) break
        }

        let process: boolean
        for(let e of entities) {

            process = true

            for(let c of this.requiredComponents) {
                
                if(!e.getComponent(c)) {

                    process = false
                }
            }
                        
            if(!process) continue


            if(this.listener) {

                this.audio = e.getComponent(EComponents.AUDIO) as AudioComponent
                this.transform = e.getComponent(EComponents.TRANSFORMATION) as TransformationComponent

                this.update(args[0])
            }
        }
    }


    update(delta: number) : void {

        const d = this.transform.position.distanceTo(this.listener.transform.position)

        if(d > this.audio.range) {
        
            if(this.audio.gain.gain.value == 0) return
            this.audio.gain.gain.setValueAtTime(0, delta)
        }
        else {

            let gain = M.map(d, 0, this.audio.range, this.audio.volume, 0)
            if(this.audio.gain.gain.value == gain) return
            this.audio.gain.gain.setValueAtTime(gain, delta)
        }
    }
}