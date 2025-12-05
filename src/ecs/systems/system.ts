import { Component, ComponentClass } from "../components/component";
import { ECS } from "../ecs";
import { Entity } from "../entity";

export abstract class System {

    abstract entities: Map<Entity, Component[]>
    abstract components: ComponentClass<any>[];

    // Hook methods for subclasses
    onEntityAdded?(entity: Entity, components: Component[]): void;
    onEntityRemoved?(entity: Entity): void;

    abstract update(ecs: ECS, dt: number, ...args): void;

    init(ecs: ECS): void {

        const match = (entity: Entity) => this.tryTrackEntity(ecs, entity);

        // Subscribe to relevant ECS events
        ecs.events.on('component-added', ({ entity }) => match(entity));
        ecs.events.on('component-removed', ({ entity }) => match(entity));
        ecs.events.on('entity-removed', (entity) => this.removeEntity(entity));

        // Initial population
        for (const entity of ecs.getAllEntities()) {

            match(entity);
        }
    }

    /** Tries to track an entity if it holds the required components for this system.
     * If not the entity will be removed
     * if its not already tracked it will be added to the tracked entities.
     */
    protected tryTrackEntity(ecs: ECS, entity: Entity): void {

        const hasAll = this.components.every(cls => ecs.getComponent(entity, cls));
        const isTracked = this.entities.has(entity);

        if (hasAll && !isTracked) {

            const comps = this.components.map(cls => ecs.getComponent(entity, cls)!);
            this.entities.set(entity, comps);
            this.onEntityAdded?.(entity, comps);
        } 
        else if (!hasAll && isTracked) {

            this.entities.delete(entity);
            this.onEntityRemoved?.(entity);
        }
    }

    /** Removes the entity from this system. */
    protected removeEntity(entity: Entity): void {

        if (this.entities.has(entity)) {
            
            this.entities.delete(entity);
            this.onEntityRemoved?.(entity);
        }
    }
}
