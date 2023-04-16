import { BufferGeometry, Line, LineBasicMaterial, LineDashedMaterial, Vector2, Vector3 } from "three";
import { EComponent, Entity, IScript, TransformationComponent } from "../core";
import { Game } from "../game";
import { AudioComponent } from "../core/components/audio-component";

const lineMaterial = new LineDashedMaterial()

const p1 = new Vector3()
const p2 = new Vector3()

export const AffectionScript = (entity: Entity): IScript => {

    const playerTransform = Game.world.getEntityByName('Player').getComponent<TransformationComponent>(EComponent.TRANSFORMATION)
    const transform = entity.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)
    const audio = entity.getComponent<AudioComponent>(EComponent.AUDIO)

    const points = [ p1, p2 ]

    const geometry = new BufferGeometry().setFromPoints(points)

    const line = new Line(geometry, lineMaterial)

    const update = (delta:number) => {

        if(playerTransform.position.distanceTo(transform.position) > audio.range) {

            Game.world.scene.remove(line)
        
        }
        else {

            p1.copy(transform.position).setY(.5)
            p2.copy(playerTransform.position).setY(.5)
        
            Game.world.scene.add(line)
        }

        geometry.setFromPoints(points)
        geometry.computeBoundingSphere()
    }

    return {
        
        update: update
    }
}