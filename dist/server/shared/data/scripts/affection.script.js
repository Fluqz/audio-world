"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffectionScript = void 0;
const three_1 = require("three");
const game_1 = require("../../../game/game");
const audio_component_1 = require("../../../../core/components/audio-component");
const utils_1 = require("../../util/utils");
const transformation_component_1 = require("../../../../core/components/transformation-component");
const graphics_component_1 = require("../../../../core/components/graphics-component");
const lineMaterial = new three_1.LineDashedMaterial();
const p1 = new three_1.Vector3();
const p2 = new three_1.Vector3();
const p3 = new three_1.Vector3();
const p4 = new three_1.Vector3();
const p5 = new three_1.Vector3();
const n = new three_1.Vector3();
let distance = 0;
const randomNormal = () => {
    n.set(Math.random() * .1, Math.random() * .1, Math.random() * .1);
    n.multiplyScalar(distance / 25);
    return n;
};
/** Script class that draws lines from the player to the entity that runs this script. */
class AffectionScript {
    start(entity, ecs) {
        console.log('YOOOOOOOOOO', ecs.getTaggedEntity('ControllablePlayer'));
        const [p] = ecs.getTaggedEntity('ControllablePlayer');
        this.player = p;
        this.playerTransform = ecs.getComponent(this.player, transformation_component_1.TransformationComponent);
        this.transform = ecs.getComponent(entity, transformation_component_1.TransformationComponent);
        this.audio = ecs.getComponent(entity, audio_component_1.AudioComponent);
        this.graphics = ecs.getComponent(entity, graphics_component_1.GraphicsComponent);
        this.color = utils_1.Utils.getRndColor();
        this.color = 0xFFFFFF; // Show color white when far away and colorfull when close
        this.points = [p1, p2, p3, p4, p5];
        this.geometry = new three_1.BufferGeometry().setFromPoints(this.points);
        let m = lineMaterial.clone();
        m.color.setHex(this.color);
        this.line = new three_1.Line(this.geometry, m);
        const g = ecs.getComponent(entity, graphics_component_1.GraphicsComponent);
        this.entitySize = g.getSize();
        distance = this.playerTransform.position.distanceTo(this.transform.position);
    }
    update(entity, ecs) {
        console.log('YOOO');
        const [p] = ecs.getTaggedEntity('ControllablePlayer');
        this.player = p;
        this.playerTransform = ecs.getComponent(this.player, transformation_component_1.TransformationComponent);
        this.transform = ecs.getComponent(entity, transformation_component_1.TransformationComponent);
        this.audio = ecs.getComponent(entity, audio_component_1.AudioComponent);
        this.graphics = ecs.getComponent(entity, graphics_component_1.GraphicsComponent);
        console.log(this.transform.position);
        // return
        distance = this.playerTransform.position.distanceTo(this.transform.position);
        // Out of range
        if (distance > this.audio.range) {
            // Game.world.scene.remove(line)
            if (this.graphics.object.userData.affection_script_inRange == true) {
                this.graphics.object.userData.affection_script_inRange = false;
                this.graphics.object.userData.affection_script_updateColor = true;
                game_1.Game.i.manager.scene.remove(this.line);
            }
            if (!this.graphics.object.userData.affection_script_inRange && this.graphics.object.userData.affection_script_updateColor) {
                this.graphics.object.traverse(o => {
                    if (o instanceof three_1.Mesh && o.material && o.material.uniforms) {
                        if (o.userData.color)
                            o.material.uniforms.color.value.setHex(o.userData.color);
                    }
                });
            }
        }
        else { // In range
            p1.copy(this.transform.position).setY(this.entitySize.y * .25);
            p2.copy(this.transform.position).add(randomNormal());
            p3.copy(p2).add(randomNormal());
            p4.copy(p3).add(randomNormal());
            p5.copy(this.playerTransform.position).setY(.5);
            this.geometry.setFromPoints(this.points);
            // Game.world.scene.add(line)
            if (!this.graphics.object.userData.affection_script_inRange) {
                this.graphics.object.userData.affection_script_inRange = true;
                this.graphics.object.userData.affection_script_updateColor = true;
                game_1.Game.i.manager.scene.add(this.line);
            }
            if (this.graphics.object.userData.affection_script_inRange && this.graphics.object.userData.affection_script_updateColor) {
                this.graphics.object.userData.affection_script_updateColor = false;
                this.graphics.object.traverse(o => {
                    if (o instanceof three_1.Mesh && o.material && !(o.material instanceof three_1.ShaderMaterial) && o.material.uniforms) {
                        // o.userData.color = o.material.uniforms.color
                        o.material.color.setHex(this.color);
                        // o.material.auniforms.color.value.setHex(color)
                    }
                });
            }
        }
    }
    destroy() {
        utils_1.Utils.dispose(this.line);
    }
}
exports.AffectionScript = AffectionScript;
//# sourceMappingURL=affection.script.js.map