"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const three_1 = require("three");
class Utils {
    static getRndColor() { return Math.round(Math.random() * 16777215); }
    static dispose(obj) {
        obj.traverse(object => {
            if (!object['isMesh'])
                return;
            object['geometry'].dispose();
            if (object['material'].isMaterial) {
                cleanMaterial(object['material']);
            }
            else {
                // an array of materials
                for (const material of object['material'])
                    cleanMaterial(material);
            }
        });
        function cleanMaterial(material) {
            material.dispose();
            // dispose textures
            for (const key of Object.keys(material)) {
                const value = material[key];
                if (value instanceof three_1.CubeTexture)
                    continue;
                if (value && typeof value === 'object' && 'minFilter' in value) {
                    value.dispose();
                }
            }
        }
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map