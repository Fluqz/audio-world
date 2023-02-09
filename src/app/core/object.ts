import { Object3D, Vector3 } from "three";
import { Component } from "./components/component";


export abstract class GameObject extends Object3D {

    /** Array of all components of this object */
    components: Component[]

    /** Normalized direction of object */
    normal: Vector3

    constructor(components?: Component[]) {

        super()

        this.components = components == undefined ? [] : components

        this.matrixAutoUpdate = false

        this.normal = new Vector3()
        this.computeNormal()
    }

    /** Add component to this GameObject */
    addComponent(component: Component) {

        if(this.components.indexOf(component) != -1) return

        this.components.push(component)
    }

    /** Remove component from this GameObject */
    removeComponent(component: Component) {

        const i = this.components.indexOf(component)

        if(i == -1) return

        this.components.splice(i, 1)
    }

    /** Get component of this GameObject */
    getComponent<T extends Component>() : T {

        for(let c of this.components) {

            if(c) return c as T
        }

        return null
    }

    /** Computes the normalized facing direction of this GameObject */
    computeNormal() {

        this.getWorldDirection(this.normal)
        return this.normal.normalize()
    }

    abstract construct?() : void
    abstract update?(delta?: number) : void
    abstract destruct?() : void
}