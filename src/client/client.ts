

import * as Tone from 'tone'
import { Game } from './app/game'
import { Globals } from "./app/globals"

Globals.dom = document.getElementById('webGL') as HTMLElement

let game = new Game(Globals.dom)
game.init()

let isInit = true

const init = () => {

    if(isInit) {
        
        isInit = false
        
        if (Tone.context.state !== 'running')
            Tone.context.resume()

        game.start()
    }
}
document.addEventListener('pointerdown', init)
document.addEventListener('touchstart', init)
document.addEventListener('keydown', init)




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
