import { Component } from "../components/component"
import { Entity } from "../entity"


export interface System {

    requiredComponents: string[]

    process(entities: Entity[], ...args) : void
}