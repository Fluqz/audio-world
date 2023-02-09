import { AnimationComponent } from "../animation-component"

export class AnimationSystem {

    private static animations: Map<string, AnimationComponent> = new Map()

    public static add(id: string, animation: AnimationComponent) {
        
        if(this.animations.has(id)) return
        this.animations.set(id, animation)
    }

    public static remove(id: string, animation: AnimationComponent) {

        if(this.animations.has(id)) return
        this.animations.delete(id)
    }

    public static update(delta: number) {

        for(let a of this.animations.values()) {

            a.update(delta)
        }
    }
}