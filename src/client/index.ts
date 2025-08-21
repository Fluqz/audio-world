
import { io } from "socket.io-client";

import { App } from "./app";

import * as Tone from 'tone'


// // Send input to server
// document.addEventListener("keydown", (e) => {
//   socket.emit("input", { key: e.key });
// });

const app = new App()

const startGame = () => {

    Tone.Transport.start()

}
document.addEventListener('click', startGame)
document.addEventListener('touchstart', startGame)
document.addEventListener('keydown', startGame)



// const socket = io();

// // Listen for world state updates
// socket.on("state", (state) => {
// //   updateLocalWorld(state);
// });
