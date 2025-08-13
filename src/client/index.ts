
import { io } from "socket.io-client";

import * as Tone from 'tone'
import { Game } from '../game/game'
import { Globals } from "../globals"




const socket = io();

// Listen for world state updates
socket.on("state", (state) => {
//   updateLocalWorld(state);
});

// // Send input to server
// document.addEventListener("keydown", (e) => {
//   socket.emit("input", { key: e.key });
// });



let hasStarted = true

Tone.Destination.volume.setValueAtTime(-80, Tone.now())

Globals.dom = document.getElementById('webGL') as HTMLElement

let game = new Game(Globals.dom)
game.init()



const startGame = () => {

    if(hasStarted) {
        
        hasStarted = false
        
        if (Tone.context.state !== 'running')
            Tone.context.resume()

        game.start()

    }
}
document.addEventListener('pointerdown', startGame)
document.addEventListener('touchstart', startGame)
document.addEventListener('keydown', startGame)



const muteBtn = document.querySelector('#mute')

muteBtn.addEventListener('click', () => {

    game.toggleMute()
    
})

window.addEventListener('focus', () => {

    game.toggleMute(false)
})
window.addEventListener('blur', () => {

    game.toggleMute(true)

    console.log('blur')

})
window.onbeforeunload = () => {

    game.toggleMute(true)

    console.log('onbeforeunload')
    
    // game.destroy()
    return
}
window.onresize = () => {

    game.resize()
}
