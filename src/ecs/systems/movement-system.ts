// systems/movement-system.ts
import { System } from "./system";
import { ECS } from "../ecs";
import { VelocityComponent } from "../components/velocity-component";
import { TransformationComponent } from "../components/transformation-component";

export class MovementSystem extends System {

    update(ecs: ECS, dt: number): void {

        for (const [entity, [pos, vel]] of ecs.queryEntities(TransformationComponent, VelocityComponent)) {
            
            // Move position by velocity * dt
            pos.position.addScaledVector(vel.velocity, dt);
        }
    }
}
