"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundingboxComponent = void 0;
const Vector3_1 = require("three/src/math/Vector3");
class BoundingboxComponent {
    constructor(center, dimensions) {
        this.center = center;
        this.dimensions = dimensions;
        this.min = new Vector3_1.Vector3();
        this.max = new Vector3_1.Vector3();
        this.min.x = center.x - dimensions.x / 2;
        this.min.y = center.y - dimensions.y / 2;
        this.min.z = center.z - dimensions.z / 2;
        this.max.x = center.x + dimensions.x / 2;
        this.max.y = center.y + dimensions.y / 2;
        this.max.z = center.z + dimensions.z / 2;
    }
    getCorner(x = 1 | -1, y = 1 | -1, z = 1 | -1) {
        return new Vector3_1.Vector3(this.center.x + ((this.dimensions.x / 2) * x), this.center.y + ((this.dimensions.y / 2) * y), this.center.z + ((this.dimensions.z / 2) * z));
    }
}
exports.BoundingboxComponent = BoundingboxComponent;
//# sourceMappingURL=boundingbox-component.js.map