import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import { World } from './world';
import { InputMessage, ClientToServerEvents, ServerToClientEvents } from '../shared/network';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 8080;

// World instance
const world = new World();

// Serve static files (built client)
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

// Serve index.html for any route
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Connection handling
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Create player on server
  const player = world.createPlayer(socket.id);

  // Notify all clients about new player
  io.emit('player:joined', {
    id: player.id,
    position: player.position,
    rotation: player.rotation,
  });

  // Handle player input
  socket.on('player:input', (inputData: InputMessage) => {
    world.handleInput(socket.id, inputData);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    world.removePlayer(socket.id);
    io.emit('player:left', socket.id);
  });
});

// Game loop - send world state to all clients
const TICK_INTERVAL = 1000 / 60; // 60 ticks per second
let lastUpdate = Date.now();

setInterval(() => {
  const now = Date.now();
  const deltaTime = (now - lastUpdate) / 1000;
  lastUpdate = now;

  // Update world
  world.update(deltaTime);

  // Send state to all clients
  const state = world.serializeState();
  io.emit('world:state', state);
}, TICK_INTERVAL);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
