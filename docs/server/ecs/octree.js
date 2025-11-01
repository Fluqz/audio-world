"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Octree = void 0;
const aabb_1 = require("./aabb");
const quadtree_node_1 = require("./quadtree-node");
class Octree {
    constructor(min, max, capacity = 8, maxDepth = 8) {
        this.entityMap = new Map();
        this.root = new quadtree_node_1.OctreeNode(new aabb_1.AABB(min, max), capacity, 0, maxDepth);
    }
    insert(entity, position) {
        if (this.entityMap.has(entity)) {
            this.update(entity, position);
            return;
        }
        this.root.insert({ entity, position });
        this.entityMap.set(entity, position.clone());
    }
    remove(entity) {
        const pos = this.entityMap.get(entity);
        if (!pos)
            return;
        this.root.remove(entity, pos);
        this.entityMap.delete(entity);
    }
    update(entity, newPosition) {
        const oldPos = this.entityMap.get(entity);
        if (!oldPos || !oldPos.equals(newPosition)) {
            if (oldPos)
                this.root.remove(entity, oldPos);
            this.root.insert({ entity, position: newPosition });
            this.entityMap.set(entity, newPosition.clone());
        }
    }
    queryBox(min, max) {
        const result = [];
        const box = new aabb_1.AABB(min, max);
        this.root.queryBox(box, result);
        return result;
    }
    queryRadius(center, radius) {
        const result = [];
        this.root.queryRadius(center, radius, result);
        return result;
    }
    clear() {
        this.entityMap.clear();
        const { min, max } = this.root.bounds;
        this.root = new quadtree_node_1.OctreeNode(new aabb_1.AABB(min, max));
    }
}
exports.Octree = Octree;
