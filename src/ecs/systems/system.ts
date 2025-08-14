import { ECS } from "../ecs";

export abstract class System {
    abstract update(ecs: ECS, dt: number): void;
}
