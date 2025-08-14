import { ECS } from "../ecs";
import { Entity } from "../entity";


export interface Component {
    // onDestroy?(entity: Entity, ecs: ECS): void;
}

export type ComponentClass<T extends Component> = new (...args: any[]) => T;

export class ComponentStore<T extends Component> {

    entities: Entity[] = [];
    components: T[] = [];
    entityToIndex: Map<Entity, number> = new Map();

    add(entity: Entity, component: T): void {
        if (this.entityToIndex.has(entity)) return;
        const index = this.entities.length;
        this.entities.push(entity);
        this.components.push(component);
        this.entityToIndex.set(entity, index);
    }

    get(entity: Entity): T | undefined {
        const index = this.entityToIndex.get(entity);
        if (index === undefined) return undefined;
        return this.components[index];
    }

    remove(entity: Entity): void {
        const index = this.entityToIndex.get(entity);
        if (index === undefined) return;

        const lastIndex = this.entities.length - 1;

        if (index !== lastIndex) {
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

    has(entity: Entity): boolean {
        return this.entityToIndex.has(entity);
    }

    getAll(): [Entity[], T[]] {
        return [this.entities, this.components];
    }
}
