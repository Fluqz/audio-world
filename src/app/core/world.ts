import { AxesHelper, Scene } from "three";
import { Entity } from "./entity";
import { System } from "./systems/system";


export class World {

    /** Container of all objects */
    scene: Scene

    /** Array of added entities */
    entities: Entity[]

    /** Array of registered systems */
    systems: System[]

    constructor() {

        this.scene = new Scene()

        this.scene.add(new AxesHelper())

        this.entities = []
        this.systems = []
    }

    update(delta: number) {

        for(let s of this.systems) s.process(this.entities, delta)
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

    registerSystem(system: System) {

        this.systems.push(system)
    }
    unregisterSystem() {}
}