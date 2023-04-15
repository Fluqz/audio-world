import { Entity } from "../entity";
import { Component, EComponents } from "./component";

export interface IScript {

    awake?: () => void
    start?: () => void
    update?: (delta:number) => void
    stop?: () => void
    destroy?: () => void
}

export class ScriptComponent implements Component {

    name: EComponents
    script: IScript

    constructor(script: (entity: Entity) => IScript, entity: Entity) {

        this.name = EComponents.SCRIPT

        this.script = script(entity)
    }
}