import { TransformationComponent } from "../components/transformation-component"
import { AnimationComponent } from "../components/animation-component"
import { System } from "./system";
import { ECS } from "../ecs";

export class AnimationSystem extends System {

    update(ecs: ECS, delta: number): void {

        for(const [e, [a, transform]] of ecs.queryEntities(AnimationComponent, TransformationComponent)) {

            if(a && a.animation) a.animation(e, transform)
        }
    }
}