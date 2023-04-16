import { AxesHelper, Mesh, MeshDistanceMaterial, MeshStandardMaterial, PlaneGeometry, Scene } from "three";
import { Entity, System } from "./";

import io from "socket.io-client"
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

        // this.scene.add(new AxesHelper())

        let ground = new Mesh(new PlaneGeometry(500, 500), new MeshStandardMaterial({ color: 0x000000 }))
        ground.geometry.rotateX(-Math.PI / 2)
        ground.position.setY(-.01)
        ground.receiveShadow = true
        this.scene.add(ground)

        this.entities = []
        this.systems = []

        // socket.on('update-client', (id, transform) => {

        //     let e = this.getEntityById(id)

        //     if(!e) return

        //     let t = e.getComponent(EComponent.TRANSFORMATION) as TransformationComponent

        //     t.position.copy(transform.position)
        //     t.quaternion.copy(transform.quaternion)
        //     t.rotation.copy(transform.rotation)
        //     t.scale.copy(transform.scale)
        //     t.needsUpdate = true

        //     console.log('updating clients transform')
        // })
    }

    /** Continues update. Updates all registered systems */
    update(delta: number) {

        for(let s of this.systems) {

            const entities = Entity.filterByComponents(this.entities, s.requiredComponents)

            s.process(entities, delta)
        }
    }

    fixedUpdate(delta: number) {

        // for(let s of this.systems) {

        //     const entities = Entity.filterByComponents(this.entities, s.requiredComponents)

        //     s.process(entities, delta)
        // }
    }


    /** Create a empty Entity */
    createEntity() : Entity {

        const e = new Entity()

        this.entities.push(e)

        return e
    }

    /** Returns a Entity with the same id as param id if found */
    getEntityById(id: string) {

        return this.entities.find(e => e.id == id)
    }

    /** Returns a Entity with the same id as param id if found */
    getEntityByName(name: string) {

        return this.entities.find(e => e.name == name)
    }

    /** Adds entity */
    addEntity(entity: Entity) {

        let i = this.entities.indexOf(entity)

        if(i != -1) return

        this.entities.push(entity)
    }
    
    /** Removes entity */
    removeEntity(entity: Entity) {

        let i = this.entities.indexOf(entity)

        if(i == -1) return

        this.entities.splice(i, 1)
    }

    /** Register system to be used by world */
    registerSystem(system: System) {

        if(this.systems.indexOf(system) != -1) return

        this.systems.push(system)
    }
    
    /** Unregister system from world */
    unregisterSystem(system: System) {

        let i = this.systems.indexOf(system)

        if(i == -1) return

        this.systems.splice(i, 1)
    }

    load(map: {}) {

        for(let m of Object.keys(map)) {

        }
    }
}