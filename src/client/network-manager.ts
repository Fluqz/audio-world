import { io, Socket } from 'socket.io-client';
import { PlayerState, WorldState, InputMessage, ClientToServerEvents, ServerToClientEvents } from '../shared/network';

export class NetworkManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  public playerId: string = '';
  public remotePlayers = new Map<string, PlayerState>();

  onStateUpdate: ((state: WorldState) => void) | null = null;
  onPlayerJoined: ((player: PlayerState) => void) | null = null;
  onPlayerLeft: ((playerId: string) => void) | null = null;

  constructor(private url: string = window.location.origin) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(this.url, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        this.playerId = this.socket!.id;
        console.log('Connected to server as player:', this.playerId);
        resolve();
      });

      this.socket.on('world:state', (state: WorldState) => {
        this.updateRemotePlayers(state);
        if (this.onStateUpdate) {
          this.onStateUpdate(state);
        }
      });

      this.socket.on('player:joined', (player: PlayerState) => {
        if (player.id !== this.playerId) {
          this.remotePlayers.set(player.id, player);
          if (this.onPlayerJoined) {
            this.onPlayerJoined(player);
          }
        }
      });

      this.socket.on('player:left', (playerId: string) => {
        this.remotePlayers.delete(playerId);
        if (this.onPlayerLeft) {
          this.onPlayerLeft(playerId);
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error);
      });
    });
  }

  private updateRemotePlayers(state: WorldState): void {
    for (const player of state.players) {
      if (player.id !== this.playerId) {
        this.remotePlayers.set(player.id, player);
      }
    }
  }

  sendInput(input: { forward: boolean; backward: boolean; left: boolean; right: boolean; jump: boolean }): void {
    if (!this.socket) return;

    const message: InputMessage = {
      playerId: this.playerId,
      input,
    };

    this.socket.emit('player:input', message);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}
