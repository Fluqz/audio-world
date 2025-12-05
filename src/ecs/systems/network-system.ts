import { System } from './system';
import { ECS } from '../ecs';
import { Entity } from '../entity';
import { PlayerState } from '../../shared/network';
import { TransformationComponent } from '../components/transformation-component';
import * as THREE from 'three';
import { Component, ComponentClass } from '../components/component';

/**
 * Manages remote player entities based on network state
 */
export class NetworkSystem extends System {
  private remotePlayerEntities = new Map<string, Entity>();

  entities: Map<number, Component[]> = new Map()
  components: ComponentClass<any>[] = [];

  player: Entity

  constructor() {
    super();
  }

  init(ecs: ECS): void {

    const result = ecs.getTaggedEntity("player")

    if (!result) return

    const [entity, components] = result

    this.player = entity

    this.tryTrackEntity(ecs, entity)
  }

  update(ecs: ECS, deltaTime: number, remotePlayersState: Map<string, PlayerState>): void {
    // Update existing remote players

    if(!remotePlayersState) return

    for (const [playerId, entity] of this.remotePlayerEntities) {
      const playerState = remotePlayersState.get(playerId);

      if (playerState) {
        const transform = ecs.getComponent<TransformationComponent>(entity, TransformationComponent);
        if (transform) {
          // Smooth interpolation towards server state
          transform.position.lerp(
            new THREE.Vector3(playerState.position.x, playerState.position.y, playerState.position.z),
            0.1 // Interpolation factor (0.1 = 10% towards target per frame)
          );

          // Update rotation
          transform.rotation.set(playerState.rotation.x, playerState.rotation.y, playerState.rotation.z);
        }
      }
    }

    // Remove players that have left
    for (const playerId of this.remotePlayerEntities.keys()) {
      if (!remotePlayersState.has(playerId)) {
        const entity = this.remotePlayerEntities.get(playerId);
        if (entity) {
          ecs.destroyEntity(entity);
        }
        this.remotePlayerEntities.delete(playerId);
      }
    }
  }

  addRemotePlayer(playerId: string, entity: Entity): void {
    this.remotePlayerEntities.set(playerId, entity);
  }

  removeRemotePlayer(playerId: string): void {
    this.remotePlayerEntities.delete(playerId);
  }

  getRemotePlayer(playerId: string): Entity | undefined {
    return this.remotePlayerEntities.get(playerId);
  }
}
