import { TransformationComponent } from "../index";
import { AnimationComponent } from "../components/animation-component"
import { EComponent } from "../components/component";
import { Entity } from "../entity";
import { System } from "./system";

export class AnimationSystem extends System {

    requiredComponents: EComponent[] = [ EComponent.ANIMATION ]

    initialize() {

        this.entities = Entity.filterByComponents(this.world.entities, this.requiredComponents)
    }

    fixedUpdate?(...args: any[]): void {}

    update(...args: any[]): void {

        // entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(const e of this.entities) {

            const a = e.getComponent<AnimationComponent>(EComponent.ANIMATION)

            const transform = e.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)

            if(a && a.animation) a.animation(e, transform)
        }
    }
}