import { EComponents, Entity, ScriptComponent, System } from ".."

export class ScriptSystem implements System {

    requiredComponents: EComponents[] = [EComponents.SCRIPT]

    private scripts: ScriptComponent[]

    process(entities: Entity[], delta: number): void {

        // entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(const e of entities) {

            this.scripts = e.getComponents<ScriptComponent>(EComponents.SCRIPT)

            for(const s of this.scripts) {

                if(s.script.update) s.script.update(delta)
            }
        }
    }
}