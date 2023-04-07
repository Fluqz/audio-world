import { Component, EComponents } from "./components/component";
import { TransformationComponent } from "./components/transformation-component";

export class Entity {

    static count: number = 0

    id: string

    name: string

    /** Array of all components of this Entity */
    components: Component[]


    constructor() {

        this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + Entity.count

        Entity.count++

        this.components = []
    }

    /** Add component to this Entity */
    addComponent(component: Component) {

        let i = this.components.indexOf(component)
        if (i != -1) return this.components.length
        this.components.push(component)
        return this.components.length
    }

    /** Remove component from this Entity */
    removeComponent(component: Component) {

        let i = this.components.indexOf(component)
        if (i == -1) return this.components.length
        this.components.splice(i, 1)
        return this.components.length
    }

    /** Get component of this Entity */
    getComponent(name: EComponents): Component {

        for (let c of this.components) {

            if (c.name == name) return c
        }

        return null
    }

    /** Get component of this Entity */
    getComponents(name: EComponents): Component[] {

        let array = []

        for (let c of this.components) {

            if (c.name == name) array.push(c)
        }

        return array
    }

    /** Filter entities that dont use the required components */
    static filterByComponents(entities: Entity[], rcs: EComponents[]) {

        return entities.filter(e => {

            let p = true
            for(let rc of rcs) {

                if(!e.getComponent(rc)) p = false
            }

            return p
        })
    }

    print() {

        console.log('ENTITY', this.name, this.id, this.components)
    }
}