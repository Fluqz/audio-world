import { Component, EComponents } from "../components/component"
import { Entity } from "../entity"


export interface System {

    /** Array if required components for this system to process. */
    requiredComponents: EComponents[]

    /** Processes all entities with the required components */
    process(entities: Entity[], ...args) : void
}