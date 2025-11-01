import { ECS } from "../ecs";
import { Entity } from "../entity";
import { System } from "./system";
import { ScriptComponent } from "../components/script-component";
import { Component, ComponentClass } from "../components/component";

export class ScriptSystem extends System {

    private initialized: Set<Entity> = new Set()

    entities: Map<number, [ScriptComponent]> = new Map()

    components: ComponentClass<any>[] = [ScriptComponent]

    init(ecs: ECS): void {
        
        const entities = ecs.queryEntities(ScriptComponent)

        for(let [e] of entities)
            this.tryTrackEntity(ecs, e)
    }

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
