import { AudioComponent } from "../audio-component";
import { AudioListenerComponent } from "../audio-listener-component";

export class AudioSystems {

    private static sources: Map<string, AudioComponent> = new Map()
    // private static listeners: Map<string, AudioListenerComponent> = new Map()

    public static add(id: string, animation: AudioComponent) {
        
        if(this.sources.has(id)) return
        this.sources.set(id, animation)
    }

    public static remove(id: string, animation: AudioComponent) {

        if(this.sources.has(id)) return
        this.sources.delete(id)
    }

    public static update(delta:number) {

        for(let a of this.sources.values()) {

            a.update(delta)
        }
    }
}

