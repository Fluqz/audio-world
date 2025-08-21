import { Vector3 } from "three";
import { AABB } from "./aabb";
import { Entity } from "./entity";
import { OctreeNode } from "./quadtree-node";


// USE THIS INSIDE ECS???? TO QUERY ENTITIES WITH OCTREE TO IMPROVE PERFORMANCE? DOES THAT MAKE ANY SENCE?
export class Octree {
    
    private root: OctreeNode;
    private entityMap: Map<Entity, Vector3> = new Map();

    constructor(min: Vector3, max: Vector3, capacity = 8, maxDepth = 8) {
        this.root = new OctreeNode(new AABB(min, max), capacity, 0, maxDepth);
    }

    insert(entity: Entity, position: Vector3): void {
        if (this.entityMap.has(entity)) {
            this.update(entity, position);
            return;
        }

        this.root.insert({ entity, position });
        this.entityMap.set(entity, position.clone());
    }

    remove(entity: Entity): void {
        const pos = this.entityMap.get(entity);
        if (!pos) return;

        this.root.remove(entity, pos);
        this.entityMap.delete(entity);
    }

    update(entity: Entity, newPosition: Vector3): void {
        const oldPos = this.entityMap.get(entity);
        if (!oldPos || !oldPos.equals(newPosition)) {
            if (oldPos) this.root.remove(entity, oldPos);
            this.root.insert({ entity, position: newPosition });
            this.entityMap.set(entity, newPosition.clone());
        }
    }

    queryBox(min: Vector3, max: Vector3): Entity[] {
        const result: Entity[] = [];
        const box = new AABB(min, max);
        this.root.queryBox(box, result);
        return result;
    }

    queryRadius(center: Vector3, radius: number): Entity[] {
        const result: Entity[] = [];
        this.root.queryRadius(center, radius, result);
        return result;
    }

    clear(): void {
        this.entityMap.clear();
        const { min, max } = this.root.bounds;
        this.root = new OctreeNode(new AABB(min, max));
    }
}
