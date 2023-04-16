import { TransformationComponent } from "../index";
import { AnimationComponent } from "../components/animation-component"
import { EComponent } from "../components/component";
import { Entity } from "../entity";
import { System } from "./system";

export class AnimationSystem implements System {

    requiredComponents: EComponent[] = [ EComponent.ANIMATION ]

    process(entities: Entity[], ...args: any[]): void {

        // entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(const e of entities) {

            const a = e.getComponent<AnimationComponent>(EComponent.ANIMATION)

            const transform = e.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)

            if(a && a.animation) a.animation(e, transform)
        }
    }
}