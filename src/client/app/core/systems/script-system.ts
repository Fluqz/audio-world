import { EComponent, Entity, ScriptComponent, System } from ".."

export class ScriptSystem extends System {

    requiredComponents: EComponent[] = [EComponent.SCRIPT]

    private scripts: ScriptComponent[]

    initialize() {

        this.filterRelevantEntities()

        for(const e of this.entities) {

            this.scripts = e.getComponents<ScriptComponent>(EComponent.SCRIPT)

            for(const s of this.scripts) {

                if(s.script.initialize) s.script.initialize()
            }
        }
    }

    fixedUpdate?(...args: any[]): void {}

    update(delta: number): void {

        // entities = Entity.filterByComponents(entities, this.requiredComponents)

        for(const e of this.entities) {

            this.scripts = e.getComponents<ScriptComponent>(EComponent.SCRIPT)

            for(const s of this.scripts) {

                if(s.script.update) s.script.update(delta)
            }
        }
    }
}