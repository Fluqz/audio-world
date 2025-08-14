import { Vector3 } from "three";
import { AABB } from "./aabb";
import { Entity } from "./entity";

export interface OctreeItem {
    entity: Entity;
    position: Vector3;
}

export class OctreeNode {
    bounds: AABB;
    items: OctreeItem[] = [];
    children: OctreeNode[] = [];
    capacity: number;
    depth: number;
    maxDepth: number;

    constructor(bounds: AABB, capacity = 8, depth = 0, maxDepth = 8) {
        this.bounds = bounds;
        this.capacity = capacity;
        this.depth = depth;
        this.maxDepth = maxDepth;
    }

    isLeaf(): boolean {
        return this.children.length === 0;
    }

    subdivide(): void {
        const { min, max } = this.bounds;
        const mid = new Vector3(
            (min.x + max.x) / 2,
            (min.y + max.y) / 2,
            (min.z + max.z) / 2,
        );

        const size = max.clone().sub(min).multiplyScalar(0.5);

        for (let dx = 0; dx <= 1; dx++) {
            for (let dy = 0; dy <= 1; dy++) {
                for (let dz = 0; dz <= 1; dz++) {
                    const offset = new Vector3(dx, dy, dz).multiply(size);
                    const nodeMin = min.clone().add(offset);
                    const nodeMax = nodeMin.clone().add(size);
                    this.children.push(new OctreeNode(new AABB(nodeMin, nodeMax), this.capacity, this.depth + 1, this.maxDepth));
                }
            }
        }
    }

    insert(item: OctreeItem): boolean {
        if (!this.bounds.containsPoint(item.position)) return false;

        if (this.isLeaf() && (this.items.length < this.capacity || this.depth >= this.maxDepth)) {
            this.items.push(item);
            return true;
        }

        if (this.isLeaf()) this.subdivide();

        for (const child of this.children) {
            if (child.insert(item)) return true;
        }

        return false;
    }

    remove(entity: Entity, position: Vector3): boolean {
        if (!this.bounds.containsPoint(position)) return false;

        if (this.isLeaf()) {
            const index = this.items.findIndex(i => i.entity === entity);
            if (index !== -1) {
                this.items.splice(index, 1);
                return true;
            }
            return false;
        }

        for (const child of this.children) {
            if (child.remove(entity, position)) return true;
        }

        return false;
    }

    queryBox(box: AABB, result: Entity[]): void {
        if (!this.bounds.intersectsBox(box)) return;

        if (this.isLeaf()) {
            for (const item of this.items) {
                if (box.containsPoint(item.position)) {
                    result.push(item.entity);
                }
            }
        } else {
            for (const child of this.children) {
                child.queryBox(box, result);
            }
        }
    }

    queryRadius(center: Vector3, radius: number, result: Entity[]): void {
        if (!this.bounds.intersectsSphere(center, radius)) return;

        const radiusSq = radius * radius;

        if (this.isLeaf()) {
            for (const item of this.items) {
                if (item.position.distanceToSquared(center) <= radiusSq) {
                    result.push(item.entity);
                }
            }
        } else {
            for (const child of this.children) {
                child.queryRadius(center, radius, result);
            }
        }
    }
}
