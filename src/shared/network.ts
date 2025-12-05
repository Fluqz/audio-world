/**
 * Shared network interfaces and types for multiplayer
 */

export interface PlayerState {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  animation?: string;
}

export interface WorldState {
  players: PlayerState[];
  entities: EntityState[];
  tick: number;
}

export interface EntityState {
  id: string;
  type: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

export interface InputMessage {
  playerId: string;
  input: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
  };
}

export interface ServerToClientEvents {
  'world:state': (state: WorldState) => void;
  'player:joined': (player: PlayerState) => void;
  'player:left': (playerId: string) => void;
}

export interface ClientToServerEvents {
  'player:input': (input: InputMessage) => void;
}
