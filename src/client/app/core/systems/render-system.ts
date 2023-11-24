import { GraphicsComponent } from "../components/graphics-component"
import { Component, EComponent } from "../components/component";
import { TransformationComponent } from "../components/transformation-component";
import { Entity } from "../entity";
import { System } from "./system";

export class RenderSystem extends System {

    requiredComponents: EComponent[] = [EComponent.GRAPHICS, EComponent.TRANSFORMATION]

    private graphics: GraphicsComponent
    private transform: TransformationComponent

    initialize() {

        this.filterRelevantEntities()
    }

    fixedUpdate?(...args: any[]): void {}

    update(...args: any[]): void {

        // entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(let e of this.entities) {

            this.transform = e.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)
            if(!this.transform.needsUpdate) continue

            this.transform.needsUpdate = false

            this.graphics = e.getComponent<GraphicsComponent>(EComponent.GRAPHICS)

            this.graphics.object.position.copy(this.transform.position)
            this.graphics.object.scale.copy(this.transform.scale)

            // How to update either euler or quaternion?
            this.graphics.object.rotation.copy(this.transform.rotation)
            // this.graphics.object.quaternion.copy(this.transform.quaternion)

            this.graphics.object.updateMatrix()
        }
    }
}