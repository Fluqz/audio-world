import { BufferGeometry, Line, LineBasicMaterial, LineDashedMaterial, Mesh, Vector2, Vector3 } from "three";
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

    const player = Game.world.getEntityByName('Player')
    const playerTransform = player.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)
    const transform = entity.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)
    const audio = entity.getComponent<AudioComponent>(EComponent.AUDIO)
    const graphics = entity.getComponent<GraphicsComponent>(EComponent.GRAPHICS)

    const color = Utils.getRndColor()

    const points = [ p1, /*p2, p3, p4,*/ p5 ]

    const geometry = new BufferGeometry().setFromPoints(points)

    let m = lineMaterial.clone()
    m.color.setHex(color)
    const line = new Line(geometry, m)

    const update = (delta:number) => {

        d = playerTransform.position.distanceTo(transform.position)

        if(d > audio.range) {

            Game.world.scene.remove(line)

            graphics.object.traverse(o => {

                if(o instanceof Mesh && o.material) {
                    
                    if(o.userData.color) o.material.uniforms.color.value.setHex(o.userData.color)
                }
            })
        
        }
        else {

            p1.copy(transform.position).setY(.5)
            // p2.copy(transform.position).add(randomNormal())
            // p3.copy(p2).add(randomNormal())
            // p4.copy(p3).add(randomNormal())
            p5.copy(playerTransform.position).setY(.5)
        
            Game.world.scene.add(line)


            graphics.object.traverse(o => {

                if(o instanceof Mesh && o.material) {
                    
                    o.userData.color = o.material.uniforms.color
                    // o.material.color.setHex(color)
                    o.material.uniforms.color.value.setHex(color)
                }
            })
        }

        geometry.setFromPoints(points)
        geometry.computeBoundingSphere()
    }

    return {
        
        update: update
    }
}