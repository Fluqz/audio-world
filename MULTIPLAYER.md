# Multiplayer Setup Guide

This document describes the multiplayer implementation for audio-world.

## Architecture

### Server (`src/server/`)
- **Express.js** server on port 8080
- **Socket.io** for real-time WebSocket communication
- **World** class manages all connected players and game state
- Runs at 60 ticks per second, broadcasting world state to clients

### Client (`src/client/`)
- **NetworkManager** handles connection and communication with server
- **NetworkSystem** (ECS) manages remote player entities
- Sends player input to server every frame
- Receives world state updates and updates remote player positions

### Shared (`src/shared/network.ts`)
- Network message types and interfaces
- Shared between server and client

## How It Works

1. **Connection**
   - Client connects to server via Socket.io
   - Server creates a player instance for the client
   - Server notifies all clients about the new player

2. **Player Input**
   - Client sends keyboard input to server every frame
   - Input includes: forward, backward, left, right, jump

3. **World State**
   - Server runs a game loop at 60 Hz
   - Updates player positions based on input
   - Broadcasts world state to all clients
   - Clients receive updates and interpolate remote player positions

4. **Cleanup**
   - When player disconnects, server removes player
   - Server notifies all clients about the disconnection

## Running

```bash
# Start both server and client dev servers
npm run dev

# Or individually:
npm run dev:server  # Express server on :8080
npm run dev:client  # Vite dev server on :3000
```

## Network Messages

### Client → Server
- `player:input` - Player's current input state

### Server → Client
- `world:state` - Current state of all players
- `player:joined` - New player connected
- `player:left` - Player disconnected

## Limitations & Future Work

- World is still procedurally generated on client (will be server-authoritative)
- No persistence - world state resets on server restart
- No entity synchronization beyond players
- No interpolation/extrapolation optimization yet
- No lag compensation or prediction

## Customization

### Changing Tick Rate
Edit `src/server/index.ts`:
```javascript
const TICK_INTERVAL = 1000 / 60; // Change 60 to desired ticks per second
```

### Changing Player Movement Speed
Edit `src/server/world.ts`:
```typescript
private static readonly MOVE_SPEED = 5; // Adjust this value
```

### Input Actions
Edit `src/ecs/systems/input-system.ts` `defaultActionMap` to change controls.
