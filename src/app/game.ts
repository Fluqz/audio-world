
import * as THREE from 'three'

import { World } from './world'
import { AssetManager } from './core/asset-manager'
import { Input } from './core/input'
import { Player } from './player'
import { Utils } from './util/utils'
import { GameObject } from './core/object'
import * as Tone from 'tone'

import * as Stats from 'stats.js'
import { GraphicsComponent } from './core/components/graphics-component'

export class Game {

    static i: Game

    public dom: HTMLElement

    public w: number
    public h: number
    public ratio: number

    public static renderer: THREE.WebGLRenderer
    public static camera: THREE.PerspectiveCamera
    public static scene: THREE.Scene
    public static renderTarget: THREE.WebGLRenderTarget

    public static master: Tone.Gain


    objects: GameObject[]

    player: Player

    world: World

    private clock: THREE.Clock
    private AFID: number

    private stats: Stats

    constructor(dom: HTMLElement) {

        Game.i = this
        
        this.AFID = undefined
        // this.clock
        this.dom = dom

        this.w = window.innerWidth
        this.h = window.innerHeight
        this.ratio = window.devicePixelRatio

        this.stats = new Stats()
        this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        Game.master = new Tone.Gain(.7)
        Game.master.toDestination()
    
        Game.renderer = new THREE.WebGLRenderer({ antialias: true })
        Game.renderer.setSize(this.w, this.h)
        Game.renderer.setClearColor(0xf4eedb)
        Game.renderer.shadowMap.enabled = true
        Game.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.dom.append(Game.renderer.domElement)
    
        Game.camera = new THREE.PerspectiveCamera(100, this.w / this.h, .1, 1000)
        Game.camera.position.set(0, 3, 0)

        Game.renderTarget = new THREE.WebGLRenderTarget(this.w, this.h, {
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping,

        })
    
        Game.scene = new THREE.Scene()
        // Game.scene.fog = new THREE.FogExp2( 0xefd1b5, .01 );
        Game.scene.fog = new THREE.Fog(0xf4eedb, 1, 50)

        // Cubemap
        const cubeMap = new THREE.CubeTextureLoader()
            .setPath( 'assets/images/cubemap/' )
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
        Game.scene.add(dLight)
        Game.scene.add(new THREE.HemisphereLight(0xf4eedb, 0xf4eedb, .7))

        new Input(this.dom)

        this.objects = []
    }

    private isMuted: boolean = false
    private stored_volume:number
    toggleMute(m?: boolean) {

        if(m == undefined) m = !this.isMuted

        if(!this.isMuted) this.stored_volume = Game.master.gain.value
        
        this.isMuted = m

        if(this.isMuted) {
            Game.master.gain.linearRampToValueAtTime(0, Tone.context.currentTime + .03)
        }
        else {
            Game.master.gain.linearRampToValueAtTime(this.stored_volume, Tone.context.currentTime + .03)
        }
    }

    init() {
        console.log('INIT')

        this.clock = new THREE.Clock()

        this.loadAssets().then(() => {

            return new Promise((resolve) => {

                this.world = new World()
                this.world.construct()
                Game.scene.add(this.world)

                this.player = new Player(Game.camera)
                Game.scene.add(this.player)

                this.player.addComponent(new GraphicsComponent())
                console.log('GET C',this.player.getComponent<GraphicsComponent>())

                this.loop()
    
                console.log('LOADED')

                resolve(null)
            })
        })
    }

    start() {
        
        Tone.Transport.start()

        // for(let tree of this.world.trees) {

        //     tree.audio.start(Tone.context.currentTime)
        // }
    }

    stop() {
        
        Tone.Transport.stop()

        // for(let tree of this.world.trees) {

        //     tree.audio.stop(Tone.context.currentTime)
        // }
    }

    update() {

        // UPDATE SYSTEMS

        for(let p of Player.list) p.update(this.clock.getDelta())

        this.world.update(this.clock.getDelta())
    }

    loop() {

        this.stats.begin()

        this.update()

        // Game.renderer.setRenderTarget(Game.renderTarget)
        // Game.renderer.render(Game.scene, Game.camera)
    
        // Game.renderer.setRenderTarget(null)
        Game.renderer.render(Game.scene, Game.camera)

        this.stats.end()

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

        this.w = window.innerWidth
        this.h = window.innerHeight
        this.ratio = window.devicePixelRatio

        Game.renderer.setSize(this.w, this.h)
        Game.renderer.setPixelRatio(this.ratio)

        Game.camera.aspect = this.w / this.h
        Game.camera.updateProjectionMatrix()
    }

    destroy() {

        this.stop()

        this.disposeAssets()
    }
}