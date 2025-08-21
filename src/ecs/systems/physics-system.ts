// systems/movement-system.ts
import { System } from "./system";
import { ECS } from "../ecs";
import { VelocityComponent } from "../components/velocity-component";
import { TransformationComponent } from "../components/transformation-component";
import { RigidbodyComponent } from "../components/rigidbody-component";

export class PhysicsSystem extends System {

    update(ecs: ECS, dt: number): void {

        for (const [entity, [transform, vel, rigid]] of ecs.queryEntities(TransformationComponent, VelocityComponent, RigidbodyComponent)) {
            
            if(rigid.isKinematic) continue

            // Move position by velocity * dt
            transform.position.addScaledVector(vel.velocity, dt)

            // console.log('position', entity, transform.position)
        }
    }
}
