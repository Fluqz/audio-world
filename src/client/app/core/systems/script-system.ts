import { EComponents, Entity, ScriptComponent, System } from ".."

export class ScriptSystem implements System {

    requiredComponents: EComponents[] = [EComponents.SCRIPT]

    private script: ScriptComponent

    process(entities: Entity[], delta: number): void {

        // entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(const e of entities) {

            this.script = e.getComponent(EComponents.SCRIPT) as ScriptComponent

            if(this.script.script.update) this.script.script.update(delta)
        }
    }
}