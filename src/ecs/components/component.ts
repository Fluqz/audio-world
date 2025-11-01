import { ECS } from "../ecs";
import { Entity } from "../entity";

export type ComponentData = Record<string, any>

export interface Component {
    __componentBrand: true; // Marker field - Typescritp structural overlap compromise
    
    /** Resolve the component. Initializes the data and creates runtime only objects. */
    resolveReferences?(ecs: ECS) : void
    serialize?() : ComponentData

    destroy?(): void;
}

export type ComponentClass<T extends Component> = new (...args: any[]) => T;

/** Class that holds all components of one type of component. */
export class ComponentStore<T extends Component> {

    /** Array of entities */
    entities: Entity[] = [];
    /** Array of components */
    components: T[] = [];

    /*+ index that references a entity to a component of type T */
    entityToIndex: Map<Entity, number> = new Map();

    /** Adds a component to the store and references the entity. */
    add(entity: Entity, component: T): void {

        if (this.entityToIndex.has(entity)) return;
        const index = this.entities.length;
        this.entities.push(entity);
        this.components.push(component);
        this.entityToIndex.set(entity, index);
    }

    /** Returns a component from the store by entity. */
    get(entity: Entity): T | undefined {
        const index = this.entityToIndex.get(entity);
        if (index === undefined) return undefined;
        return this.components[index];
    }

    /** Removes  */
    remove(entity: Entity): void {
        const index = this.entityToIndex.get(entity);
        if (index === undefined) return;

        const lastIndex = this.entities.length - 1;

        if (index !== lastIndex) { // TODO _ WHY SWAP? WHATS GOING ON?
            // Swap with last element
            const lastEntity = this.entities[lastIndex];
            this.entities[index] = lastEntity;
            this.components[index] = this.components[lastIndex];
            this.entityToIndex.set(lastEntity, index);
        }

        this.entities.pop();
        this.components.pop();
        this.entityToIndex.delete(entity);
    }

    /** Checks for a entity */
    has(entity: Entity): boolean {
        return this.entityToIndex.has(entity);
    }

    /** Returns all entities and all components */
    getAll(): [Entity[], T[]] {
        return [this.entities, this.components];
    }
}
