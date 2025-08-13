"use strict";
// import { TransformationComponent } from "../components/transformation-component";
// import { ECS } from "../ecs";
// import { System } from "./system";
Object.defineProperty(exports, "__esModule", { value: true });
class GameMap {
    getChunkAt(x, y) {
        return this.chunks.get(`${x},${y}`);
    }
}
class MapChunk {
}
class Scene {
}
class SceneManager {
    loadScene(scene, ecs) {
        this.currentScene?.onExit?.(ecs);
        ecs.clear(); // or unload all entities
        this.currentScene = scene;
        scene.onEnter?.(ecs);
    }
}
// class ChunkLoaderSystem extends System {
//     loadedChunks: Set<string> = new Set();
//     radius = 2; // Load 2 chunks around player
//     update(ecs: ECS, dt: number): void {
//         const playerEntity = ecs.getTaggedEntity("ControllablePlayer", TransformationComponent);
//         if (!playerEntity) return;
//         const [_, [transform]] = playerEntity;
//         const cx = Math.floor(transform.position.x / map.chunkSize);
//         const cy = Math.floor(transform.position.y / map.chunkSize);
//         // Load chunks around player
//         for (let dx = -this.radius; dx <= this.radius; dx++) {
//             for (let dy = -this.radius; dy <= this.radius; dy++) {
//                 const key = `${cx + dx},${cy + dy}`;
//                 if (!this.loadedChunks.has(key)) {
//                     const chunk = map.getChunkAt(cx + dx, cy + dy);
//                     if (chunk) {
//                         this.loadChunk(chunk, ecs);
//                         this.loadedChunks.add(key);
//                     }
//                 }
//             }
//         }
//         // Optionally: Unload distant chunks
//         // ...
//     }
//     loadChunk(chunk: MapChunk, ecs: ECS) {
//         // Spawn entities from chunk data
//         for (const obj of chunk.data.objects) {
//             const e = ecs.createEntity();
//             ecs.addComponent(e, new Position(obj.x, obj.y));
//             ecs.addComponent(e, new Renderable(obj.sprite));
//             // etc...
//         }
//     }
// }
//# sourceMappingURL=chunk-loader-system.js.map