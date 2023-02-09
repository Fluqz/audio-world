import { Scene } from "three";
import { Entity } from "./core/entity";
import { System } from "./core/systems/system";


export class World {

    /** Scene */
    scene: Scene

    /** All added entities */
    entities: Entity[]

    /** Registered Components */
    components: string[]

    systems: System[]

    constructor() {

        this.scene = new Scene()

        this.entities = []
        this.components = []
        this.systems = []
    }

    createEntity() : Entity {

        const e = new Entity()

        this.entities.push(e)

        return e
    }

    removeEntity(entity: Entity) : Entity {

        let i = this.entities.indexOf(entity)

        if(i == -1) return

        this.entities.splice(i, 1)
    }

    registerComponent() {}
    unregisterComponent() {}
}