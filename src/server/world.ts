import { PlayerState, WorldState, EntityState, InputMessage } from '../shared/network';

export interface ServerPlayer {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  input: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
  };
}

export class World {
  private players = new Map<string, ServerPlayer>();
  private tick = 0;
  private static readonly TICK_RATE = 60; // 60 ticks per second
  private static readonly MOVE_SPEED = 5;

  constructor() {}

  createPlayer(playerId: string): ServerPlayer {
    const player: ServerPlayer = {
      id: playerId,
      position: { x: 0, y: 1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      input: {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
      },
    };

    this.players.set(playerId, player);
    return player;
  }

  removePlayer(playerId: string): void {
    this.players.delete(playerId);
  }

  handleInput(playerId: string, input: InputMessage): void {
    const player = this.players.get(playerId);
    if (player) {
      player.input = input.input;
    }
  }

  update(deltaTime: number): void {
    this.tick++;

    // Update player positions based on input
    for (const player of this.players.values()) {
      this.updatePlayer(player, deltaTime);
    }
  }

  private updatePlayer(player: ServerPlayer, deltaTime: number): void {
    const moveSpeed = World.MOVE_SPEED;
    
    // Reset velocity each frame
    player.velocity.x = 0;
    player.velocity.z = 0;

    // Calculate movement direction based on input
    if (player.input.forward) {
      player.velocity.z -= moveSpeed;
    }
    if (player.input.backward) {
      player.velocity.z += moveSpeed;
    }
    if (player.input.left) {
      player.velocity.x -= moveSpeed;
    }
    if (player.input.right) {
      player.velocity.x += moveSpeed;
    }

    // Apply gravity (simple)
    player.velocity.y -= 9.81 * deltaTime;
    
    // Update position
    player.position.x += player.velocity.x * deltaTime;
    player.position.y += player.velocity.y * deltaTime;
    player.position.z += player.velocity.z * deltaTime;
    // console.log('update world',player.input, player.id, player.position);

    // Keep player above ground
    if (player.position.y < 0) {
      player.position.y = 0;
      player.velocity.y = 0;
    }
  }

  getPlayers(): ServerPlayer[] {
    return Array.from(this.players.values());
  }

  getPlayer(playerId: string): ServerPlayer | undefined {
    return this.players.get(playerId);
  }

  serializeState(): WorldState {
    return {
      players: this.getPlayers().map(p => ({
        id: p.id,
        position: p.position,
        rotation: p.rotation,
      })),
      entities: [], // TODO: Add static entities
      tick: this.tick,
    };
  }
}
