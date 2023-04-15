import { BufferGeometry, Line, LineBasicMaterial, Vector2, Vector3 } from "three";
import { EComponents, Entity, IScript, TransformationComponent } from "../core";
import { Game } from "../game";


export const TraceScript = (entity: Entity): IScript => {

    const points: Vector3[] = []
    const geometry = new BufferGeometry().setFromPoints(points)
    const trace = new Line(geometry, new LineBasicMaterial({ color: 0xFFFF00 }))

    Game.world.scene.add(trace)

    const transform = entity.getComponent(EComponents.TRANSFORMATION) as TransformationComponent

    let v: Vector3

    const update = (delta:number) => {

        if(points.length > 1000) v = points.shift()
        else v = transform.position.clone().setY(.5)

        points.push(v)

        geometry.setFromPoints(points)
    }

    return {
        
        update: update
    }
}