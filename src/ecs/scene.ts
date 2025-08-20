import { SceneData, SceneEntityData } from "../client/scene-manager";
import { Component, ComponentClass } from "./components/component";
import { NameComponent } from "./components/name-component";
import { ECS } from "./ecs";
import { Entity } from "./entity";

export class Scene {

    name: string;
    ecs: ECS;

    constructor(name: string) {
        this.name = name;
        this.ecs = new ECS();
    }

    /** Resolves all entities and initializes their runtime only data. */
    resolveAllReferences() {

        for (const entity of this.ecs.getAllEntities()) {

            const components = this.getAllComponentsForEntity(this.ecs, entity);

            for (const comp of components) {

                comp.resolveReferences?.(this.ecs);
            }
        }
    }

    /** ECS Update function. Updating systems and keeping the world in sync. */
    update(dt: number) {
        this.ecs.update(dt);
    }

    /** Returns all components of an entity. */
    getAllComponentsForEntity(ecs: ECS, entity: Entity): Component[] {

        const result: Component[] = [];

        for (const store of ecs.componentStores.values()) {

            const component = store.get(entity);
            
            if (component) result.push(component);
        }

        return result;
    }

    /** Returns all entities together with their components. */
    *getAllEntitiesWithComponents(ecs: ECS): Iterable<[Entity, Map<ComponentClass<Component>, Component>]> {

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

    unload() {

        for(let e of this.ecs.entities) {

            this.ecs.destroyEntity(e)
        }
    }

    serialize() : SceneData {

        const entities: SceneEntityData[] = [];

        for (const [entity, components] of this.getAllEntitiesWithComponents(this.ecs)) {

            const data: SceneEntityData = {

                name: this.ecs.getComponent(entity, NameComponent)?.name,
                components: {}
            };

            for (const [componentClass, component] of components) {

                const componentName = componentClass.name;
                // const serialized = component.serialize?.() ?? { ...component }; TODO - All components need to serialize!
                const serialized = component.serialize?.() ?? null
                
                data.components[componentName] = serialized;
            }

            entities.push(data);
        }

        return { entities }
    }
}
