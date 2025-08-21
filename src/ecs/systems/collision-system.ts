// collision-system.ts

import { BoxCollisionComponent } from "../components/box-collision-component";
import { TransformationComponent } from "../components/transformation-component";
import { ECS } from "../ecs";
import { System } from "./system";

export class CollisionSystem extends System {


    constructor() {
        super()
    }

    update(ecs: ECS, dt: number): void {
        
        const eComp = ecs.queryEntities(TransformationComponent, BoxCollisionComponent)

        const ec = Array.from(eComp)

        
        for(let i = 0; i < ec.length; i++) {

            for(let j = i + 1; j < ec.length; j++) {


                
                const a = ec[i]
                const b = ec[j]

                console.log('collider', a, b)

            // const posA = ecs.getComponent(a, Position)
            // const posB = ecs.getComponent(b, Position)
            // const colA = ecs.getComponent(a, Collider)
            // const colB = ecs.getComponent(b, Collider)

            // if (checkCollision(posA, colA, posB, colB)) {

            //     console.log(`Collision detected between ${a} and ${b}`);
            //     // Here: dispatch event, add "Colliding" component, or call response system
            // }
            }
        }
    }
}
