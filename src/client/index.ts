
import { io } from "socket.io-client";

import * as Tone from 'tone'
import { Game } from '../client/game'
import { Globals } from "../globals"
import { saveScene } from "../ecs/scene";
import { Entity } from "../ecs/entity";




const socket = io();

// Listen for world state updates
socket.on("state", (state) => {
//   updateLocalWorld(state);
});

// // Send input to server
// document.addEventListener("keydown", (e) => {
//   socket.emit("input", { key: e.key });
// });



let hasStarted = false

Tone.Destination.volume.setValueAtTime(-80, Tone.now())

Globals.dom = document.getElementById('webGL') as HTMLElement

let game = new Game(Globals.dom)
game.init()



const startGame = () => {

    if(!hasStarted) {
        
        hasStarted = true
        
        if (Tone.context.state !== 'running')
            Tone.context.resume()

        game.start()

    }
    else {

        // game.ecs.entities.forEach((e: Entity) => {

        //     console.log(e, game.ecs.getAllComponents(e))
        // })

        console.log('Save', JSON.stringify(saveScene(game.ecs)))
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
