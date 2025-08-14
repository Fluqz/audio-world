import { BufferGeometry, Line, LineDashedMaterial, Mesh, ShaderMaterial, Vector2, Vector3 } from "three";
import { Game } from "../../../game/game";
import { AudioComponent } from "../../../ecs/components/audio-component";
import { Utils } from "../../util/utils";
import { ECS } from "../../../ecs/ecs";
import { TransformationComponent } from "../../../ecs/components/transformation-component";
import { GraphicsComponent } from "../../../ecs/components/graphics-component";
import { Entity } from "../../../ecs/entity";
import { Script } from "../../../ecs/components/script-component";

const lineMaterial = new LineDashedMaterial()

const p1 = new Vector3()
const p2 = new Vector3()
const p3 = new Vector3()
const p4 = new Vector3()
const p5 = new Vector3()

const n = new Vector3()

let distance = 0

const randomNormal = () => {

    n.set(Math.random() * .1, Math.random() * .1, Math.random() * .1)
    n.multiplyScalar(distance / 25)

    return n
}

/** Script class that draws lines from the player to the entity that runs this script. */
export class AffectionScript implements Script {
    
    private player: Entity
    private playerTransform: TransformationComponent
    private transform: TransformationComponent
    private audio: AudioComponent
    private graphics: GraphicsComponent

    private points: Vector3[]
    private geometry: BufferGeometry
    private color: number

    private line: Line

    private entitySize: Vector3

    public start(entity: Entity, ecs: ECS) {
            
        console.log('YOOOOOOOOOO', ecs.getTaggedEntity('ControllablePlayer'))
        const [p] = ecs.getTaggedEntity('ControllablePlayer')
        this.player = p

        
        this.playerTransform = ecs.getComponent(this.player, TransformationComponent)
        this.transform = ecs.getComponent(entity, TransformationComponent)
        this.audio = ecs.getComponent(entity, AudioComponent)
        this.graphics = ecs.getComponent(entity, GraphicsComponent)

        this.color = Utils.getRndColor()
        this.color = 0xFFFFFF // Show color white when far away and colorfull when close

        this.points = [ p1, p2, p3, p4, p5 ]

        this.geometry = new BufferGeometry().setFromPoints(this.points)

        let m = lineMaterial.clone()
        m.color.setHex(this.color)
        this.line = new Line(this.geometry, m)

        const g = ecs.getComponent(entity, GraphicsComponent)
        this.entitySize = g.getSize()

        distance = this.playerTransform.position.distanceTo(this.transform.position)
    }

    update(entity: Entity, ecs: ECS) {

        console.log('YOOO')

        const [p] = ecs.getTaggedEntity('ControllablePlayer')
        this.player = p
        this.playerTransform = ecs.getComponent(this.player, TransformationComponent)
        this.transform = ecs.getComponent(entity, TransformationComponent)
        this.audio = ecs.getComponent(entity, AudioComponent)
        this.graphics = ecs.getComponent(entity, GraphicsComponent)

        console.log(this.transform.position)

        // return
        distance = this.playerTransform.position.distanceTo(this.transform.position)

        // Out of range
        if(distance > this.audio.range) {

            // Game.world.scene.remove(line)

            if(this.graphics.object.userData.affection_script_inRange == true) {

                this.graphics.object.userData.affection_script_inRange = false
                this.graphics.object.userData.affection_script_updateColor = true
                Game.i.manager.scene.remove(this.line)
            }

            if(!this.graphics.object.userData.affection_script_inRange && this.graphics.object.userData.affection_script_updateColor) {

                this.graphics.object.traverse(o => {

                    if(o instanceof Mesh && o.material && o.material.uniforms) {
                        
                        if(o.userData.color) o.material.uniforms.color.value.setHex(o.userData.color)
                    }
                })
            }
        }
        else { // In range

            p1.copy(this.transform.position).setY(this.entitySize.y * .25)
            p2.copy(this.transform.position).add(randomNormal())
            p3.copy(p2).add(randomNormal())
            p4.copy(p3).add(randomNormal())
            p5.copy(this.playerTransform.position).setY(.5)
        
            this.geometry.setFromPoints(this.points)

            // Game.world.scene.add(line)

            if(!this.graphics.object.userData.affection_script_inRange) {

                this.graphics.object.userData.affection_script_inRange = true
                this.graphics.object.userData.affection_script_updateColor = true
                Game.i.manager.scene.add(this.line)
            }

            if(this.graphics.object.userData.affection_script_inRange && this.graphics.object.userData.affection_script_updateColor) {

                this.graphics.object.userData.affection_script_updateColor = false

                this.graphics.object.traverse(o => {

                    if(o instanceof Mesh && o.material && !(o.material instanceof ShaderMaterial)  && o.material.uniforms) {
                        
                        // o.userData.color = o.material.uniforms.color
                        o.material.color.setHex(this.color)
                        // o.material.auniforms.color.value.setHex(color)
                    }
                })
            }
        }
    }

    destroy() {

        Utils.dispose(this.line)
    }
}