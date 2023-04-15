import { TransformationComponent } from "../index";
import { AnimationComponent } from "../components/animation-component"
import { EComponents } from "../components/component";
import { Entity } from "../entity";
import { System } from "./system";

export class AnimationSystem implements System {

    requiredComponents: EComponents[] = [ EComponents.ANIMATION ]

    process(entities: Entity[], ...args: any[]): void {

        // entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(const e of entities) {

            const a = e.getComponent(EComponents.ANIMATION) as AnimationComponent

            const transform = e.getComponent(EComponents.TRANSFORMATION) as TransformationComponent

            if(a && a.animation) a.animation(e, transform)
        }
    }
}