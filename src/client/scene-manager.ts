import { Component, ComponentData } from "../ecs/components/component";
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

    scene: Scene
      
    saveScene(scene: Scene): SceneData {

      return scene.serialize()
    }
    
    /** Loads a scene.json file and creates a new scene with the entities from the file. */
    async loadScene(path: string): Promise<Scene> {

      const sceneJson: SceneData = await fetch(path).then(res => res.json());

      const scene = new Scene(sceneJson.name ?? 'Scene');

      for (const entityData of sceneJson.entities) {

        // if (entityData.name) ecs.addName(entity, entityData.name)

        const components = this.getComponentsFromEntityData(entityData);

        scene.ecs.createEntityWithComponents(components)
      }

      return scene;
    }

    /** Loads a prefab.json file and creates and adds an entity to the scene */
    async loadPrefabFromFile(path: string) {

      const entityData: SceneEntityData = await fetch(path).then(res => res.json());

      const components = this.getComponentsFromEntityData(entityData);

      return this.scene.ecs.createEntityWithComponents(components)
    }


    /** Returns an array of components from the given entity data */
    private getComponentsFromEntityData(entityData: SceneEntityData) {

        const components: Component[] = []

        for (const [componentName, rawData] of Object.entries(entityData.components)) {

            const ComponentClass = componentRegistry[componentName];

            if (!ComponentClass) {

                console.error(`Component Registry - Unknown component "${componentName}" during scene load.`);
                continue;
            }

            const componentInstance = new ComponentClass(rawData);
            components.push(componentInstance);
        }

        return components
    }
}