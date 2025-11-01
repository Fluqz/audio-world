import { ComponentClass } from "../components/component";
import { TransformationComponent } from "../components/transformation-component";
import { ECS } from "../ecs";
import { Entity } from "../entity";
import { Octree } from "../octree";
import { System } from "./system";

export class SpatialSystem extends System {
    private octree: Octree;
    private trackedEntities: Set<Entity> = new Set();

    entities: Map<number, [TransformationComponent]> = new Map()

    components: ComponentClass<any>[] = [TransformationComponent]

    init(ecs: ECS): void {
        
        const entities = ecs.queryEntities(TransformationComponent)

        for(let [e] of entities)
            this.tryTrackEntity(ecs, e)
    }

    constructor(octree: Octree) {
        super();
        this.octree = octree;
    }

    update(ecs: ECS, dt: number): void {

        for (const [entity, [transform]] of this.entities.entries()) {

            this.octree.insert(entity, transform.position) // internally handles updates
            this.trackedEntities.add(entity)
        }

        for (const entity of this.trackedEntities) {

            if (!ecs.entityExists(entity)) {

                const transform = ecs.getComponent(entity, TransformationComponent)

                if (transform) this.octree.remove(entity)

                this.trackedEntities.delete(entity)
            }
        }
    }
}
