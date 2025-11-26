// import express from "express";
// import http from "http";
// import path from "path";
// import { Server } from "socket.io";
// import { World } from "./world"; // your ECS

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // Serve static frontend files
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "client"))); // your HTML/JS/CSS go here

// // ECS world instance
// const world = new World();

// io.on("connection", (socket) => {
//   const playerId = world.createPlayer();
//   console.log(`Player connected: ${socket.id}`);

//   // Handle player input
//   socket.on("input", (inputData) => {
//     world.handleInput(playerId, inputData);
//   });

//   socket.on("disconnect", () => {
//     console.log(`Player disconnected: ${socket.id}`);
//     world.removePlayer(playerId);
//   });
// });

// // Send world state to all clients every 50ms
// setInterval(() => {
//   const snapshot = world.serializeState();
//   io.emit("state", snapshot);
// }, 50);

// const PORT = process.env.PORT || 8080;
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

console.log('SERVER INDEX.JS FILE WORKING')

io.on('connection', (socket) => {
  console.log('a user connected');
  // Your socket handlers here
});

server.listen(9000, () => {
  console.log('Server listening on port 9000');
});
