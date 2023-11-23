import { Entity } from "../entity";
import { Component, EComponent } from "./component";

export interface IScript {

    initialize?: () => void
    update?: (delta:number) => void
    destroy?: () => void
}

export class ScriptComponent implements Component {

    name: EComponent
    script: IScript

    constructor(script: (entity: Entity) => IScript, entity: Entity) {

        this.name = EComponent.SCRIPT

        this.script = script(entity)
    }
}