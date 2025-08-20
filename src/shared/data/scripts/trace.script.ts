import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial, Vector2, Vector3 } from "three";

import { Script } from "../../../ecs/components/script-component";
import { TransformationComponent } from "../../../ecs/components/transformation-component";
import { Game } from "../../../client/game";
import { Utils } from "../../util/utils";
import { ECS } from "../../../ecs/ecs";
import { Entity } from "../../../ecs/entity";


/** Script class that draws a path which shows the way the entity was moving. */
export class TraceScript implements Script {

    private points: Vector3[] = []
    private geometry: BufferGeometry
    private trace: Line

    private transform: TransformationComponent

    private v: Vector3

    private lastPosition: Vector3

    public start = (entity: Entity, ecs: ECS) => {

        this.geometry = new BufferGeometry().setFromPoints(this.points)
        this.trace = new Line(this.geometry, new LineBasicMaterial({ color: 0x000000, depthTest: false, depthWrite: false }))

        this.transform = ecs.getComponent(entity, TransformationComponent) as TransformationComponent

        Game.i.renderManager.scene.add(this.trace)

        this.lastPosition = new Vector3().copy(this.transform.position)
    }

    public update = (delta:number) => {

        if(this.lastPosition.equals(this.transform.position)) return

        if(this.points.length > 5000) {

            this.v = this.points.shift()
            this.v.copy(this.transform.position)
        }
        else this.v = this.transform.position.clone()

        this.points.push(this.v)

        // // Flatten the points into a regular array
        // const positionArray: number[] = []

        // for (let i = 0; i < this.points.length; i++) {
        //     positionArray.push(this.points[i].x, this.points[i].y, this.points[i].z);
        // }

        // // Create Float32Array from the regular array
        // const positions = new Float32Array(positionArray);

        // const positionAttribute = this.geometry.getAttribute('position') as THREE.BufferAttribute;

        // if (positionAttribute && positionAttribute.array.length >= positions.length) {
        // // Reuse existing buffer (if large enough)

        //     positionAttribute.copyArray(newArray)
        //     positionAttribute.needsUpdate = true;
        // } else {
        // // Replace attribute with larger buffer
        //     this.geometry.setAttribute('position', new BufferAttribute(positions, 3));
        // }

        // this.trace.geometry = this.geometry
        // this.geometry.computeBoundingSphere()


        this.geometry.dispose()
        this.geometry = new BufferGeometry().setFromPoints(this.points)
        this.geometry.computeBoundingSphere()
    }

    public destroy = () => {

        Utils.dispose(this.trace)
    }
}