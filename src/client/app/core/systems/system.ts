import { Component, EComponent } from "../components/component"
import { Entity } from "../entity"
import { World } from "../world"


export abstract class System {

    /** Reference to the World instance */
    world: World

    /** List of relevant entities to be processed */
    entities: Entity[]

    /** Array if required components for this system to update. */
    requiredComponents: EComponent[]

    constructor(world: World, requiredComponents?: EComponent[]) {

        this.world = world
        this.requiredComponents = requiredComponents
    }

    /** Initializes the system */
    abstract initialize()

    /** Is called per frame. Processes all entities with the required components */
    abstract update(...args) : void

    /** Is called at a physical simulated rate. Processes all entities with the required components */
    abstract fixedUpdate?(...args) : void
}