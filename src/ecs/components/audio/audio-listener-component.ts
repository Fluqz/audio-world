import { ECS } from "../../ecs";
import { Entity } from "../../entity";
import { Component, ComponentData } from "../component";

export class AudioListenerComponent implements Component {
    __componentBrand: true

    public transformRefTag: string

    public transformRefEntity: Entity

    constructor(data: { transformRefTag: string }) {

        this.transformRefTag = data.transformRefTag
    }

    resolveReferences(ecs: ECS): void {
        
        this.transformRefEntity = ecs.getTaggedEntity(this.transformRefTag)?.[0]
    }

    serialize(): ComponentData {
        
        return {
            TransformationComponent: this.transformRefTag
        }
    }
}