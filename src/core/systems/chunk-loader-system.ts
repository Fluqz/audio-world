// import { TransformationComponent } from "../components/transformation-component";
// import { ECS } from "../ecs";
// import { System } from "./system";

import { ECS } from "../ecs";

class GameMap {
    name: string;
    chunkSize: number;
    chunks: Map<string, MapChunk>; // key: "x,y"

    getChunkAt(x: number, y: number): MapChunk | undefined {
        return this.chunks.get(`${x},${y}`);
    }
}

class MapChunk {
    x: number;
    y: number;
    data: any; // tiles, objects, etc.
}


class Scene {
    name: string;
    map: GameMap;
    onEnter?(ecs: ECS): void;
    onExit?(ecs: ECS): void;
}

class SceneManager {
    currentScene?: Scene;

    loadScene(scene: Scene, ecs: ECS) {
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