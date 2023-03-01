import { AxesHelper, Mesh, MeshDistanceMaterial, MeshStandardMaterial, PlaneGeometry, Scene } from "three";
import { Entity } from "./entity";
import { System } from "./systems/system";

import io from "socket.io-client"
import { EComponents } from "./components/component";
import { TransformationComponent } from "./components/transformation-component";
const socket = io()

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

        let ground = new Mesh(new PlaneGeometry(500, 500), new MeshDistanceMaterial())
        ground.geometry.rotateX(-Math.PI / 2)
        ground.receiveShadow = true
        this.scene.add(ground)

        this.entities = []
        this.systems = []

        socket.on('update-client', (id, transform) => {

            let e = this.getEntityById(id)

            if(!e) return

            let t = e.getComponent(EComponents.TRANSFORMATION) as TransformationComponent

            t.position.copy(transform.position)
            t.quaternion.copy(transform.quaternion)
            t.rotation.copy(transform.rotation)
            t.scale.copy(transform.scale)
            t.needsUpdate = true

            console.log('updating clients transform')
        })
    }

    update(delta: number) {

        for(let s of this.systems) s.process(this.entities, delta)
    }

    createEntity() : Entity {

        const e = new Entity()

        this.entities.push(e)

        return e
    }

    getEntityById(id: string) {

        return this.entities.find(e => e.id == id)
    }

    removeEntity(entity: Entity) {

        let i = this.entities.indexOf(entity)

        if(i == -1) return

        this.entities.splice(i, 1)
    }

    registerSystem(system: System) {

        this.systems.push(system)
    }
    unregisterSystem(system: System) {

        let i = this.systems.indexOf(system)

        if(i == -1) return

        this.systems.splice(i, 1)
    }
}