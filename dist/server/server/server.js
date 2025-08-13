"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const world_1 = require("./world"); // your ECS
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
// Serve static frontend files
const __dirname = path_1.default.resolve();
app.use(express_1.default.static(path_1.default.join(__dirname, "client"))); // your HTML/JS/CSS go here
// ECS world instance
const world = new world_1.World();
io.on("connection", (socket) => {
    const playerId = world.createPlayer();
    console.log(`Player connected: ${socket.id}`);
    // Handle player input
    socket.on("input", (inputData) => {
        world.handleInput(playerId, inputData);
    });
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        world.removePlayer(playerId);
    });
});
// Send world state to all clients every 50ms
setInterval(() => {
    const snapshot = world.serializeState();
    io.emit("state", snapshot);
}, 50);
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map