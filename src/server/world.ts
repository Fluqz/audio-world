import { Entity } from "../ecs/entity";
import { ECS } from "../ecs/ecs";
import { TransformationComponent } from "../ecs/components/transformation-component";

// ecs-world.js (server)
export class World {

  // ecs: ECS 
  // players = new Set<Entity>()

  // constructor() {
  //   // ...your component store setup
  // }

  // createPlayer() {
  //   const entity = this.ecs.createEntity();
  //   this.ecs.addComponent(entity, TransformationComponent);
  //   if(this.players.has(entity)) this.players.add(entity)
  //   return entity;
  // }

  // removePlayer(entity) {
  //   this.players.delete(entity);
  //   this.ecs.destroyEntity(entity);
  // }

  // handleInput(entity, input) {
  //   // Game-specific input handling that modifies ECS components
  // }

  // serializeState() {
  //   return this.players.forEach(p => ({
  //     id: p,
  //     position: this.ecs.getComponent(p, TransformationComponent),
  //   }));
  // }
}
