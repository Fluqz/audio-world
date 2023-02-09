import { Component } from "./components/i-component";

export class Entity {

    static count: number = 0

    id: string

    /** Array of all components of this Entity */
    components: Map<string, Component>


    constructor() {

        this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + Entity.count

        Entity.count++
    }

    /** Add component to this Entity */
    addComponent(component: Component) {

        this.components.set(component.name, component)
    }

    /** Remove component from this Entity */
    removeComponent(component: Component) {

        this.components.delete(component.name)
    }

    /** Get component of this Entity */
    getComponent<T extends Component>() : T {

        for(let c of this.components.values()) {

            if(c) return c as T
        }

        return null
    }

    print() {

        console.log('ENTITY',this.id, this.components)
    }
}