import { ECS } from "../ecs";
import { Entity } from "../entity";
import { System } from "./system";
import { ScriptComponent } from "../components/script-component";

export class ScriptSystem extends System {

    private initialized: Set<Entity> = new Set()

    update(ecs: ECS, dt: number): void {

        for (const [entity, [scriptComp]] of ecs.queryEntities(ScriptComponent)) {

            if (!this.initialized.has(entity)) {

                for (const script of scriptComp.scripts) {

                    script.start?.(entity, ecs)
                }

                this.initialized.add(entity)
            }

            for (const script of scriptComp.scripts) {

                script.update?.(entity, ecs, dt)
            }
        }
    }
}
