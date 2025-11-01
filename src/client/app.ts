
import { io } from "socket.io-client";

import * as Tone from 'tone'
import { Game } from '../client/game'
import { Globals } from "../globals"
import { Entity } from "../ecs/entity";

export class App {

    game: Game

    hasStarted = false

    private muteBtn: HTMLElement

    constructor() { this.init() }
    
    
    init() {
        console.log('App init()');
        
        Tone.Destination.volume.setValueAtTime(-80, Tone.now())

        Globals.dom = document.getElementById('webGL') as HTMLElement


        this.game = new Game(Globals.dom)
        this.game.init()


        document.addEventListener('click', this.startGame.bind(this))
        document.addEventListener('touchstart', this.startGame.bind(this))
        document.addEventListener('keydown', this.startGame.bind(this))


        this.muteBtn = document.querySelector('#mute')

        this.muteBtn.addEventListener('click', () => {

            this.game.toggleMute()
            
        })

        window.addEventListener('focus', () => {

            this.game.toggleMute(false)
        })
        window.addEventListener('blur', () => {

            this.game.toggleMute(true)

            // console.log('blur')

        })
        window.onbeforeunload = () => {

            this.game.toggleMute(true)

            // console.log('onbeforeunload')
            
            // this.game.destroy()
            return
        }
        window.onresize = () => {

            this.game.resize()
        }
    }



    startGame() {

        if(!this.hasStarted) {
            
            console.log('START ' ) 

            this.hasStarted = true
            
            if (Tone.context.state !== 'running')
                Tone.context.resume()

            Tone.Transport.start()
            
            this.game.start()

            console.log('Save', JSON.stringify(this.game.sceneManager.saveScene(this.game.sceneManager.scene)))
        }
        else {

        }
    }
}
