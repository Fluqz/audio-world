import { ECS } from "../ecs";
import { Entity } from "../entity";
import { Component } from "./component";

export interface Script {
    
    start?(entity: Entity, ecs: ECS): void
    update?(entity: Entity, ecs: ECS, dt: number): void
    destroy?(entity: Entity, ecs: ECS): void
}

export class ScriptComponent implements Component {

    scripts: Script[]

    constructor(...scripts: Script[]) {
        
        this.scripts = scripts
    }


}