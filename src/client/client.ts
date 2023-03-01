

import * as Tone from 'tone'
import { Game } from './app/game'
import { Globals } from "./app/globals"

Globals.dom = document.getElementById('webGL') as HTMLElement

let game = new Game(Globals.dom)

let isInit = true

document.addEventListener('mousedown', () => {

    if(isInit) {
        
        isInit = false
        
        if (Tone.context.state !== 'running')
            Tone.context.resume()

        game.init()
        game.start()
    }
})




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
