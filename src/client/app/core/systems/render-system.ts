import { GraphicsComponent } from "../components/graphics-component"
import { Component, EComponents } from "../components/component";
import { TransformationComponent } from "../components/transformation-component";
import { Entity } from "../entity";
import { System } from "./system";

export class RenderSystem implements System {

    requiredComponents: EComponents[] = [EComponents.GRAPHICS, EComponents.TRANSFORMATION]

    private graphics: GraphicsComponent
    private transform: TransformationComponent

    process(entities: Entity[], ...args: any[]): void {

        entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(let e of entities) {

            this.graphics = e.getComponent(EComponents.GRAPHICS) as GraphicsComponent
            this.transform = e.getComponent(EComponents.TRANSFORMATION) as TransformationComponent

            if(!this.transform.needsUpdate) continue

            this.transform.needsUpdate = false

            this.graphics.object.position.copy(this.transform.position)
            this.graphics.object.scale.copy(this.transform.scale)

            // How to update either euler or quaternion?
            this.graphics.object.rotation.copy(this.transform.rotation)
            // this.graphics.object.quaternion.copy(this.transform.quaternion)

            this.graphics.object.updateMatrix()
        }
    }
}