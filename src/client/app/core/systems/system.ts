import { Component, EComponent } from "../components/component"
import { Entity } from "../entity"


export interface System {

    /** Array if required components for this system to process. */
    requiredComponents: EComponent[]

    /** Processes all entities with the required components */
    process(entities: Entity[], ...args) : void
}