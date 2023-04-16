import { Utils } from "../util/utils";
import { Component, EComponents } from "./components/component";
import { TransformationComponent } from "./components/transformation-component";

export class Entity {

    static count: number = 0

    private _id: string
    get id() { return this._id }

    name: string

    /** Array of all components of this Entity */
    components: Component[]


    constructor() {

        this._id = Utils.makeUID()

        Entity.count++

        this.components = []
    }

    /** Add component to this Entity */
    addComponent(component: Component) {

        const i = this.components.indexOf(component)
        if (i != -1) return this.components.length
        this.components.push(component)
        return this.components.length
    }

    /** Remove component from this Entity */
    removeComponent(component: Component) {

        const i = this.components.indexOf(component)
        if (i == -1) return this.components.length
        this.components.splice(i, 1)
        return this.components.length
    }

    /** Get component of this Entity */
    getComponent<T>(name: EComponents): T {

        for (const c of this.components) {

            if (c.name == name) return c as T
        }

        return null
    }

    /** Get component of this Entity */
    getComponents<T>(name: EComponents): T[] {

        const array = []

        for (const c of this.components) {

            if (c.name == name) array.push(c as T)
        }

        return array
    }

    /**
     * Filter entities that dont use the required components.
     * 
     * @param entities Entity array
     * @param rcs Array of EComponents
     * @returns a new, filtered Array of Entities
     */
    static filterByComponents(entities: Entity[], rcs: EComponents[]) {

        return entities.filter(e => {

            let p = true
            for (let rc of rcs) {

                if (!e.getComponent(rc)) p = false
            }

            return p
        })
    }

    print() {

        console.log('ENTITY', this.name, this.id, this.components)
    }
}