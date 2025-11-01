"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderSystem = void 0;
const graphics_component_1 = require("../components/graphics-component");
const transformation_component_1 = require("../components/transformation-component");
const system_1 = require("./system");
class RenderSystem extends system_1.System {
    constructor(ecs, renderManager) {
        super();
        this.ecs = ecs;
        this.renderManager = renderManager;
    }
    update(ecs, dt) {
        for (const [e, [transform, graphics]] of ecs.queryEntities(transformation_component_1.TransformationComponent, graphics_component_1.GraphicsComponent)) {
            this.transform = transform;
            if (!this.transform.needsUpdate)
                continue;
            this.transform.needsUpdate = false;
            this.graphics = graphics;
            this.graphics.object.position.copy(this.transform.position);
            this.graphics.object.scale.copy(this.transform.scale);
            // How to update either euler or quaternion?
            this.graphics.object.rotation.copy(this.transform.rotation);
            // this.graphics.object.quaternion.copy(this.transform.quaternion)
            this.graphics.object.updateMatrix();
        }
    }
}
exports.RenderSystem = RenderSystem;
//# sourceMappingURL=render-system.js.map