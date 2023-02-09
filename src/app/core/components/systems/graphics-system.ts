import { GraphicsComponent } from "../graphics-component"

export class GraphicsSystem {

    private static animations: Map<string, GraphicsComponent> = new Map()

    public static add(id: string, animation: GraphicsComponent) {
        
        if(this.animations.has(id)) return
        this.animations.set(id, animation)
    }

    public static remove(id: string, animation: GraphicsComponent) {

        if(this.animations.has(id)) return
        this.animations.delete(id)
    }

    public static update(delta: number) {

        for(let a of this.animations.values()) {

            a.update(delta)
        }
    }
}