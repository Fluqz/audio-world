"use strict";
// import express from "express";
// import http from "http";
// import path from "path";
// import { Server } from "socket.io";
// import { World } from "./world"; // your ECS
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    console.log('a user connected');
    // Your socket handlers here
});
server.listen(9000, () => {
    console.log('Server listening on port 9000');
});
//# sourceMappingURL=index.js.map