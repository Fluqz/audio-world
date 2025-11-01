"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationSystem = void 0;
const transformation_component_1 = require("../components/transformation-component");
const animation_component_1 = require("../components/animation-component");
const system_1 = require("./system");
class AnimationSystem extends system_1.System {
    update(ecs, delta) {
        for (const [e, [a, transform]] of ecs.queryEntities(animation_component_1.AnimationComponent, transformation_component_1.TransformationComponent)) {
            if (a && a.animation)
                a.animation(e, transform);
        }
    }
}
exports.AnimationSystem = AnimationSystem;
//# sourceMappingURL=animation-system.js.map