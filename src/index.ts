

import * as Tone from 'tone'
import { Game } from './app/game'
import { Globals } from "./app/core/globals"



Globals.dom = document.getElementById('webGL')

let isPause = true

document.addEventListener('mousedown', () => {

    if(isPause) {
        isPause = false
        game.start()
    }
})


let game = new Game(Globals.dom)
game.init()


const muteBtn = document.querySelector('#mute')

muteBtn.addEventListener('click', () => {

    game.toggleMute()
    
})

window.addEventListener('focus', () => {

    game.toggleMute(false)
})
            
window.addEventListener('blur', () => {

    game.toggleMute(true)
})
            
window.onbeforeunload = () => {
    
    // game.destroy()
    return
}

window.onresize = () => {

    game.resize()
}