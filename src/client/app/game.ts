import * as THREE from 'three'
import * as Tone from 'tone'
import * as Stats from 'stats.js'

import { Globals } from './globals'
import { AssetManager } from './core/asset-manager'
import { Input } from './core/input'

import { World } from './core/world'
import { Prefabs } from './core/prefabs'
import { Utils } from './util/utils'

import { EComponents } from './core/components/component'
import { TransformationComponent } from './core/components/transformation-component'

import { RenderSystem } from './core/systems/render-system'
import { FirstPersonControllerSystem } from './core/systems/first-person-controller-system'
import { AudioSystem } from './core/systems/audio-system'

import io from "socket.io-client"
import { Entity } from './core/entity'
import { AudioListenerComponent } from './core/components/audio-listener-component'
const socket = io()


export class Game {

    static i: Game

    public dom: HTMLElement

    public static renderer: THREE.WebGLRenderer
    public static camera: THREE.PerspectiveCamera

    public static world: World

    public static master: Tone.Volume

    private clock: THREE.Clock
    private AFID: number

    private stats: Stats

    constructor(dom: HTMLElement) {

        Game.i = this
        
        // this.clock
        this.dom = dom

        Globals.w = window.innerWidth
        Globals.h = window.innerHeight
        Globals.ratio = window.devicePixelRatio

        this.stats = new Stats()
        this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        Game.master = new Tone.Volume(.9)
        Game.master.toDestination()
    
        Game.renderer = new THREE.WebGLRenderer({ antialias: true })
        Game.renderer.setSize(Globals.w, Globals.h)
        Game.renderer.setClearColor(0xf4eedb)
        Game.renderer.shadowMap.enabled = true
        Game.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.dom.append(Game.renderer.domElement)
    
        Game.camera = new THREE.PerspectiveCamera(40, Globals.w / Globals.h, 1, 1000)
        Game.camera.position.set(0, 0, 5)
        Game.camera.lookAt(0, 0, 0)

        Game.world = new World()

        // Game.scene.fog = new THREE.FogExp2( 0xefd1b5, .01 );
        Game.world.scene.fog = new THREE.Fog(0xf4eedb, 1, 50)

        // Cubemap
        const cubeMap = new THREE.CubeTextureLoader()
            .setPath( Globals.path + 'assets/images/cubemap/' )
            .load( [
                'px.png',
                'nx.png',
                'py.png',
                'ny.png',
                'pz.png',
                'nz.png'
        ])
        // Game.scene.background = cubeMap
        // Game.scene.add(new THREE.GridHelper(1000, 1000))

        let dLight = new THREE.DirectionalLight(0xf4eedb, .8)
        dLight.position.set(50, 50, 50)
        dLight.castShadow = true
        dLight.shadow.camera.far = 200
        dLight.shadow.camera.near = .1
        dLight.shadow.camera.top = 200
        dLight.shadow.camera.bottom = -200
        dLight.shadow.camera.left = -200
        dLight.shadow.camera.right = 200
        dLight.shadow.mapSize.width = 4096
        dLight.shadow.mapSize.height = 4096
        Game.world.scene.add(dLight)
        Game.world.scene.add(new THREE.HemisphereLight(0xf4eedb, 0xf4eedb, .7))

        new Input(this.dom)
    }

    init() {
        console.log('INIT')

        this.clock = new THREE.Clock()

        this.loadAssets().then(() => {

            return new Promise((resolve) => {

                this.loop()
    
                console.log('LOADED')

                // Create Player
                let player = Prefabs.ControllablePlayer()

                Game.world.registerSystem(new RenderSystem())
                Game.world.registerSystem(new FirstPersonControllerSystem())
                Game.world.registerSystem(new AudioSystem(player.getComponent(EComponents.AUDIO_LISTENER) as AudioListenerComponent))


                socket.on('connecting', (id: string, clients) => {

                    player.id = id

                    console.log('clients', clients)

                    // Array.from(clients).forEach(c => {

                    //     console.log(c)

                    //     let p = Prefabs.Player()
                    //     p.id = id
                    // })
                })

                socket.on('add-client', (id) => {

                    console.log('Add another player')
                    let p = Prefabs.Player()
                    p.id = id
                })

                let amount = 30
                let range = 500

                // this.instanciateRandomly(Prefabs.Tree, amount * 2, range)
                // this.instanciateRandomly(Prefabs.DeadTree, amount, range)
                // this.instanciateRandomly(Prefabs.Stone, amount, range)
                this.instanciateRandomly(Prefabs.Tree, 1, 2)

                resolve(null)
            })
        })
    }

    private instanciateRandomly(instaciateFunc: () => Entity, amount: number, range: number) {

        for(let i = 0; i < amount; i++) {

            let prefab = instaciateFunc()
            let transform = prefab.getComponent(EComponents.TRANSFORMATION) as TransformationComponent
            
            if(transform) {
                
                transform.position.set(
                    (Math.random() * range) - (range / 2),
                    0,
                    (Math.random() * range) - (range / 2),
                )
                transform.needsUpdate = true   
            }
        }
    }

    start() {
        
        Tone.Transport.start()

    }

    stop() {
        
        Tone.Transport.stop()

    }

    private isMuted: boolean = false
    private stored_volume:number
    toggleMute(m?: boolean) {

        if(m == undefined) m = !this.isMuted

        if(!this.isMuted) this.stored_volume = Game.master.volume.value
        
        this.isMuted = m

        if(this.isMuted) {
            Game.master.volume.linearRampToValueAtTime(0, Tone.context.currentTime + .03)
        }
        else {
            Game.master.volume.linearRampToValueAtTime(this.stored_volume, Tone.context.currentTime + .03)
        }
    }


    update() {

        // UPDATE SYSTEMS

        Game.world.update(this.clock.getDelta())

    }

    loop() {

        if(Globals.debug) this.stats.begin()

        this.update()

        Game.renderer.render(Game.world.scene, Game.camera)

        if(Globals.debug) this.stats.end()

        window.cancelAnimationFrame(this.AFID)
        this.AFID = window.requestAnimationFrame(this.loop.bind(this))
    }

    loadAssets() {

        return new Promise(resolve => {

            AssetManager.onload = () => {
                console.log('Load fin')
                resolve(null)
            }

            resolve(null)

            // AssetManager.load('https://hitpuzzle.b-cdn.net/SolSeat_VR_00075_joined2.glb')
            // AssetManager.load('https://hitpuzzle.b-cdn.net/06627.glb')
            // AssetManager.load('https://hitpuzzle.b-cdn.net/LOWPOLY1%20(1).glb')
            
        })
    }

    disposeAssets() {

        for(let a of AssetManager.assets.values()) {

            Utils.dispose(a.scene)
        }
    }

    resize() {

        Globals.w = window.innerWidth
        Globals.h = window.innerHeight
        Globals.ratio = window.devicePixelRatio

        Game.renderer.setSize(Globals.w, Globals.h)
        Game.renderer.setPixelRatio(Globals.ratio)

        Game.camera.aspect = Globals.w / Globals.h
        Game.camera.updateProjectionMatrix()
    }

    destroy() {

        this.stop()

        this.disposeAssets()
    }
}