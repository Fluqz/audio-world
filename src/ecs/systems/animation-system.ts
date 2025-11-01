import { TransformationComponent } from "../components/transformation-component"
import { AnimationComponent } from "../components/animation-component"
import { System } from "./system";
import { ECS } from "../ecs";
import { Component, ComponentClass } from "../components/component";

export class AnimationSystem extends System {

    entities: Map<number, Component[]> = new Map()
    components: ComponentClass<any>[] = [AnimationComponent, TransformationComponent]

    init(ecs: ECS): void {


    }

    update(ecs: ECS, delta: number): void {

        for(const [e, [a, transform]] of ecs.queryEntities(AnimationComponent, TransformationComponent)) {

            if(a && a.animation) a.animation(e, transform)
        }
    }
}