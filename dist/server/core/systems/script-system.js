"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptSystem = void 0;
const system_1 = require("../systems/system");
const script_component_1 = require("../components/script-component");
class ScriptSystem extends system_1.System {
    constructor() {
        super(...arguments);
        this.initialized = new Set();
    }
    update(ecs, dt) {
        for (const [entity, [scriptComp]] of ecs.queryEntities(script_component_1.ScriptComponent)) {
            if (!this.initialized.has(entity)) {
                for (const script of scriptComp.scripts) {
                    script.start?.(entity, ecs);
                }
                this.initialized.add(entity);
            }
            for (const script of scriptComp.scripts) {
                script.update?.(entity, ecs, dt);
            }
        }
    }
}
exports.ScriptSystem = ScriptSystem;
//# sourceMappingURL=script-system.js.map