"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetManager = void 0;
const THREE = __importStar(require("three"));
const GLTFLoader_1 = require("three/examples/jsm/loaders/GLTFLoader");
class AssetManager {
    static get onload() { return this._onload; }
    static set onload(o) {
        this._onload = o;
        this.mgmt.onLoad = this._onload;
    }
    static load(path) {
        console.log('load');
        return new Promise((resolve, reject) => {
            if (!path)
                reject();
            let gltf = AssetManager.assets.get(path);
            if (gltf) {
                // console.log('CLONE')
                resolve(gltf);
            }
            AssetManager.gltfLoader.load(path, (gltf) => {
                AssetManager.assets.set(path, gltf);
                resolve(gltf);
            }, undefined, // progress => {  },
            // progress => {  },
            error => { console.error(error); reject(); });
        });
    }
}
exports.AssetManager = AssetManager;
AssetManager.assets = new Map();
AssetManager.mgmt = new THREE.LoadingManager();
AssetManager.gltfLoader = new GLTFLoader_1.GLTFLoader(AssetManager.mgmt);
//# sourceMappingURL=asset-manager.js.map