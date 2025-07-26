import { BufferGeometry, Line, LineBasicMaterial, Vector2, Vector3 } from "three";
import { EComponent, Entity, IScript, TransformationComponent } from "../core";
import { Game } from "../game";
import { Utils } from "../util/utils";


/** Script class that draws a path which shows the way the entity was moving. */
export const TraceScript = (entity: Entity): IScript => {

    const points: Vector3[] = []
    let geometry: BufferGeometry
    let trace: Line

    let transform: TransformationComponent

    let v: Vector3

    let lastPosition: Vector3

    const initialize = () => {

        geometry = new BufferGeometry().setFromPoints(points)
        trace = new Line(geometry, new LineBasicMaterial({ color: 0x000000, depthTest: false, depthWrite: false }))

        transform = entity.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)

        Game.world.scene.add(trace)

        lastPosition = new Vector3().copy(transform.position)
    }

    const update = (delta:number) => {

        if(lastPosition.equals(transform.position)) return

        if(points.length > 5000) {

            v = points.shift()
            v.copy(transform.position).setY(.5)
        }
        else v = transform.position.clone().setY(.5)

        points.push(v)

        geometry.setFromPoints(points)
        geometry.computeBoundingSphere()
    }

    const destroy = () => {

        Utils.dispose(trace)
    }


    return {
        
        update: update,
        initialize: initialize,
        destroy: destroy,
    }
}