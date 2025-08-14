"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AABB = void 0;
const three_1 = require("three");
class AABB {
    constructor(min, max) {
        this.min = min.clone();
        this.max = max.clone();
    }
    containsPoint(p) {
        return (p.x >= this.min.x && p.x <= this.max.x &&
            p.y >= this.min.y && p.y <= this.max.y &&
            p.z >= this.min.z && p.z <= this.max.z);
    }
    intersectsBox(other) {
        return !(this.max.x < other.min.x || this.min.x > other.max.x ||
            this.max.y < other.min.y || this.min.y > other.max.y ||
            this.max.z < other.min.z || this.min.z > other.max.z);
    }
    intersectsSphere(center, radius) {
        const closest = new three_1.Vector3(Math.max(this.min.x, Math.min(center.x, this.max.x)), Math.max(this.min.y, Math.min(center.y, this.max.y)), Math.max(this.min.z, Math.min(center.z, this.max.z)));
        const distSq = center.distanceToSquared(closest);
        return distSq <= radius * radius;
    }
}
exports.AABB = AABB;
