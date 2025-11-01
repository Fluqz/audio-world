// systems/movement-system.ts
import { System } from "./system";
import { ECS } from "../ecs";
import { VelocityComponent } from "../components/velocity-component";
import { TransformationComponent } from "../components/transformation-component";
import { RigidbodyComponent } from "../components/rigidbody-component";
import { Component, ComponentClass } from "../components/component";

export class PhysicsSystem extends System {

    entities: Map<number, [TransformationComponent, VelocityComponent, RigidbodyComponent]> = new Map()

    components: ComponentClass<any>[] = [TransformationComponent, VelocityComponent, RigidbodyComponent]

    init(ecs: ECS): void {
        
        const queried = ecs.queryEntities(TransformationComponent, VelocityComponent, RigidbodyComponent)

        for(let [e, [c, c1, c2]] of queried) {

            this.tryTrackEntity(ecs, e)
        }
    }

    update(ecs: ECS, dt: number): void {

        for (const [entity, [transform, vel, rigid]] of this.entities.entries()) {
            
            if(rigid.isKinematic) continue

            // Move position by velocity * dt
            transform.position.addScaledVector(vel.velocity, dt)

            // console.log('position', entity, transform.position)
        }
    }
}
