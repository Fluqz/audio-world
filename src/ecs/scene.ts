import { ECS } from "./ecs";
import { Entity } from "./entity";
import { Component, ComponentClass, ComponentData } from "./components/component";
import { componentRegistry } from "./components/registry"; // We'll make this below
import { NameComponent } from "./components/name-component";

export type SceneEntityData = {
    name?: string;
    components: ComponentData;
};

export type SceneData = {
    entities: SceneEntityData[];
};

export function saveScene(ecs: ECS): SceneData {

    const entities: SceneEntityData[] = [];

    for (const [entity, components] of getAllEntitiesWithComponents(ecs)) {

        const data: SceneEntityData = {

            name: ecs.getComponent(entity, NameComponent)?.name, // or use a dedicated NameComponent
            components: {}
        };

        for (const [componentClass, component] of components) {

            const componentName = componentClass.name;
            // const serialized = component.serialize?.() ?? { ...component };
            const serialized = component.serialize?.() ?? null
            
            data.components[componentName] = serialized;
        }

        entities.push(data);
    }

    return { entities };
}

export function loadScene(scene: SceneData, ecs: ECS): void {

    for (const entityData of scene.entities) {

        const entity = ecs.createEntity();

        if (entityData.name) {

            ecs.addName(entity, entityData.name); // optional
        }

        for (const [componentName, rawData] of Object.entries(entityData.components)) {

            const ComponentClass = componentRegistry[componentName];

            if (!ComponentClass) {

                console.warn(`Unknown component "${componentName}" during scene load.`);
                continue;
            }

            const componentInstance = new ComponentClass(rawData);
            ecs.addComponent(entity, componentInstance);
        }
    }
}

function* getAllEntitiesWithComponents(ecs: ECS): Iterable<[Entity, Map<ComponentClass<Component>, Component>]> {

    const seen = new Set<Entity>();

    for (const [ComponentType, store] of (ecs as any).componentStores.entries()) {

        const [entities] = store.getAll();

        for (const entity of entities) {

            if (!seen.has(entity)) {

                seen.add(entity);

                const components = new Map<ComponentClass<Component>, Component>();

                for (const [T, s] of (ecs as any).componentStores.entries()) {

                    if (s.has(entity)) {

                        components.set(T, s.get(entity));
                    }
                }

                yield [entity, components];
            }
        }
    }
}
