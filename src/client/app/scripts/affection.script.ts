import { BufferGeometry, Line, LineBasicMaterial, LineDashedMaterial, Mesh, ShaderMaterial, Vector2, Vector3 } from "three";
import { EComponent, Entity, GraphicsComponent, IScript, TransformationComponent } from "../core";
import { Game } from "../game";
import { AudioComponent } from "../core/components/audio-component";
import { Utils } from "../util/utils";

const lineMaterial = new LineDashedMaterial()

const p1 = new Vector3()
const p2 = new Vector3()
const p3 = new Vector3()
const p4 = new Vector3()
const p5 = new Vector3()
const n = new Vector3()
let d = 0

const randomNormal = () => {

    n.set(Math.random() * .1, Math.random() * .1, Math.random() * .1)
    n.multiplyScalar(d / 3)

    return n
}

export const AffectionScript = (entity: Entity): IScript => {
    
    let player: Entity
    let playerTransform: TransformationComponent
    let transform: TransformationComponent
    let audio: AudioComponent
    let graphics: GraphicsComponent

    let points: [Vector3, Vector3]
    let geometry: BufferGeometry
    let color: number

    let line: Line

    const initialize = () => {
            
        player = Game.world.getEntityByName('Player')
        playerTransform = player.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)
        transform = entity.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)
        audio = entity.getComponent<AudioComponent>(EComponent.AUDIO)
        graphics = entity.getComponent<GraphicsComponent>(EComponent.GRAPHICS)

        color = Utils.getRndColor()
        color = 0xFFFFFF

        points = [ p1, /*p2, p3, p4,*/ p5 ]

        geometry = new BufferGeometry().setFromPoints(points)

        let m = lineMaterial.clone()
        m.color.setHex(color)
        line = new Line(geometry, m)
    }

    const update = (delta:number) => {

        // return
        d = playerTransform.position.distanceTo(transform.position)

        // Out of range
        if(d > audio.range) {

            // Game.world.scene.remove(line)


            if(graphics.object.userData.affection_script_inRange == true) {

                graphics.object.userData.affection_script_inRange = false
                graphics.object.userData.affection_script_updateColor = true
                Game.world.scene.remove(line)
            }

            if(!graphics.object.userData.affection_script_inRange && graphics.object.userData.affection_script_updateColor) {

                graphics.object.traverse(o => {

                    if(o instanceof Mesh && o.material && o.material.uniforms) {
                        
                        if(o.userData.color) o.material.uniforms.color.value.setHex(o.userData.color)
                    }
                })
            }
        
        }
        else { // In range

            p1.copy(transform.position).setY(.5)
            // p2.copy(transform.position).add(randomNormal())
            // p3.copy(p2).add(randomNormal())
            // p4.copy(p3).add(randomNormal())
            p5.copy(playerTransform.position).setY(.5)
        
            geometry.setFromPoints(points)

            // Game.world.scene.add(line)

            if(!graphics.object.userData.affection_script_inRange) {

                graphics.object.userData.affection_script_inRange = true
                graphics.object.userData.affection_script_updateColor = true
                Game.world.scene.add(line)
            }

            if(graphics.object.userData.affection_script_inRange && graphics.object.userData.affection_script_updateColor) {

                graphics.object.userData.affection_script_updateColor = false

                graphics.object.traverse(o => {

                    if(o instanceof Mesh&& o.material && !(o.material instanceof ShaderMaterial)  && o.material.uniforms) {
                        
                        // o.userData.color = o.material.uniforms.color
                        o.material.color.setHex(color)
                        // o.material.auniforms.color.value.setHex(color)
                    }
                })
            }
        }

    }

    const destroy = () => {

        Utils.dispose(line)
    }


    return {
        
        update: update,
        initialize: initialize,
        destroy: destroy,
    }
}