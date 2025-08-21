import { ComponentData } from "../ecs/components/component";
import { componentRegistry } from "../ecs/components/registry";
import { Scene } from "../ecs/scene";

/** Entity data format */
export type SceneEntityData = {
    name?: string;
    components: ComponentData;
}

/** Data format of the scene */
export type SceneData = {
    name?:string
    entities: SceneEntityData[];
}



export class SceneManager {

    activeScene: Scene
      
    saveScene(scene: Scene): SceneData {

      return scene.serialize()
    }
    
    async loadScene(path: string): Promise<Scene> {

      const sceneJson: SceneData = await fetch(path).then(res => res.json());

      const scene = new Scene(sceneJson.name ?? 'Scene');


      for (const entityData of sceneJson.entities) {

        const entity = scene.ecs.createEntity();

        // if (entityData.name) ecs.addName(entity, entityData.name)

        for (const [componentName, rawData] of Object.entries(entityData.components)) {

            const ComponentClass = componentRegistry[componentName];

            if (!ComponentClass) {

                console.error(`Component Registry - Unknown component "${componentName}" during scene load.`);
                continue;
            }

            const componentInstance = new ComponentClass(rawData);
            scene.ecs.addComponent(entity, componentInstance);
        }
      }

      return scene;
    }
}