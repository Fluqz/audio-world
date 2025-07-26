import * as THREE from 'three'
import * as Stats from 'stats.js'
import * as Tone from 'tone'

import { Globals } from './globals'
import { AssetManager } from './core/asset-manager'
import { Input } from './core/input'

import { Prefabs } from './data/prefabs'
import { Utils } from './util/utils'

import { Entity, World, AnimationSystem, ScriptSystem, AudioListenerComponent, AudioSystem, FirstPersonControllerSystem, RenderSystem, TransformationComponent, EComponent, GraphicsComponent } from './core'

import { Subject } from 'rxjs'

import io from "socket.io-client"
import { ForestGenerator } from './core/generators/forest-generator/forest-generator'
import { Tree } from './core/generators/forest-generator/tree'
const socket = io()


export class Game {

    static i: Game

    public dom: HTMLElement

    public static renderer: THREE.WebGLRenderer
    public static camera: THREE.PerspectiveCamera

    public static world: World

    public static master: Tone.Volume

    private updateClock: THREE.Clock
    private fixedUpdateClock: THREE.Clock

    private backgroundColor = 0xffe800 // ffe5b9 0xf4eedb 0xffe800
    
    private AFID: number

    private stats: Stats

    public onAwake: Subject<null> = new Subject()
    public onStart: Subject<null> = new Subject()
    public onUpdate: Subject<null> = new Subject()
    public onFixedUpdate: Subject<null> = new Subject()
    public onStop: Subject<null> = new Subject()
    public onDestroy: Subject<null> = new Subject()

    constructor(dom: HTMLElement) {

        Game.i = this

        // this.clock
        this.dom = dom


        Globals.w = window.innerWidth
        Globals.h = window.innerHeight
        Globals.ratio = window.devicePixelRatio


        Game.master = new Tone.Volume(-2)
        Game.master.toDestination()
        Tone.Destination

        Game.renderer = new THREE.WebGLRenderer({ antialias: true })
        Game.renderer.setSize(Globals.w, Globals.h)
        Game.renderer.setClearColor(this.backgroundColor)
        Game.renderer.shadowMap.enabled = true
        Game.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.dom.append(Game.renderer.domElement)

        Game.camera = new THREE.PerspectiveCamera(45, Globals.w / Globals.h, .1, 1000)
        Game.camera.position.set(0, 0, 5)
        Game.camera.lookAt(0, 0, 0)


        Game.world = new World()

        // Game.scene.fog = new THREE.FogExp2( 0xefd1b5, .01 );
        Game.world.scene.fog = new THREE.Fog(this.backgroundColor, 1, 750)

        // Cubemap
        const cubeMap = new THREE.CubeTextureLoader()
            .setPath(Globals.path + 'assets/images/cubemap/')
            .load([
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


        if (Globals.debug) {

            this.stats = new Stats()
            this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom)
        }
    }

    init() {
        console.log('INIT')

        this.fixedUpdateClock = new THREE.Clock()
        this.updateClock = new THREE.Clock()

        this.onAwake.next(null)

        this.loadAssets().then(() => {

            return new Promise((resolve) => {

                this.onStart.next(null)

                Game.world.registerSystem(new FirstPersonControllerSystem(Game.world))
                Game.world.registerSystem(new RenderSystem(Game.world))
                Game.world.registerSystem(new AnimationSystem(Game.world))
                Game.world.registerSystem(new AudioSystem(Game.world, Game.world.getEntityByName('Player').getComponent<AudioListenerComponent>(EComponent.AUDIO_LISTENER)))
                Game.world.registerSystem(new ScriptSystem(Game.world))

                this.loop()

                console.log('LOADED')
                resolve(null)
            })
        })
    }

    private instanciateRandomly(instaciateFunc: () => Entity, amount: number, range: number) {

        for (let i = 0; i < amount; i++) {

            let prefab = instaciateFunc()
            let transform = prefab.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)

            if (transform) {

                transform.position.set(
                    (Math.random() * range) - (range / 2),
                    0,
                    (Math.random() * range) - (range / 2),
                )

                transform.rotation.set(
                    0,
                    (Math.random() * 2 * Math.PI),
                    0
                )
                transform.needsUpdate = true
            }
        }
    }

    start() {

        Tone.Transport.start()

    }

    stop() {

        this.onStop.next(null)

        Tone.Transport.stop()
    }

    private isMuted: boolean = false
    private stored_volume: number
    toggleMute(m?: boolean) {

        if (m == undefined) m = !this.isMuted

        if (!this.isMuted) this.stored_volume = Game.master.volume.value

        this.isMuted = m

        if (this.isMuted) {

            setTimeout(() => {

                Game.master.mute = true
                Tone.Destination.mute = true
                Game.master.volume.setValueAtTime(Number.NEGATIVE_INFINITY, Tone.context.currentTime)

            }, 150)

            Game.master.volume.linearRampToValueAtTime(-70, Tone.context.currentTime + .15)
        }
        else {
            
            Game.master.mute = false
            Tone.Destination.mute = false
            Game.master.volume.linearRampToValueAtTime(this.stored_volume, Tone.context.currentTime + .1)
        }
    }


    update() {

        this.onUpdate.next(null)

        Game.world.update(this.updateClock.getDelta())

        Game.renderer.render(Game.world.scene, Game.camera)
    }

    private fixedUpdateTiming: number = 20;
    private physicsTimeSimulated: number = Date.now();
    // private _deltaTime: number = 0;
    // private lastUpdate: number = Date.now();

    fixedUpdate() {

        while (this.physicsTimeSimulated < Date.now()) {

            this.physicsTimeSimulated += this.fixedUpdateTiming;

            this.onFixedUpdate.next(null)

            Game.world.fixedUpdate(this.fixedUpdateClock.getDelta())
        }

        // this._deltaTime = Date.now() - this.lastUpdate;
        // console.log('fix delta',this._deltaTime)
        // this.lastUpdate = Date.now();
    }

    loop() {

        if (Globals.debug) this.stats.begin()

        this.update()
        this.fixedUpdate()

        if (Globals.debug) this.stats.end()

        window.cancelAnimationFrame(this.AFID)
        this.AFID = window.requestAnimationFrame(this.loop.bind(this))
    }

    loadAssets() {

        return new Promise(resolve => {

            AssetManager.onload = () => {
                console.log('Load fin')
                resolve(null)
            }

            // Create Player
            let player = Prefabs.ControllablePlayer()

            // socket.on('connecting', (id: string, clients) => {

            //     player.id = id

            //     console.log('clients', clients)

            //     // Array.from(clients).forEach(c => {

            //     //     console.log(c)

            //     //     let p = Prefabs.Player()
            //     //     p.id = id
            //     // })
            // })

            // socket.on('add-client', (id) => {

            //     console.log('Add another player')
            //     let p = Prefabs.Player()
            //     p.id = id
            // })

            let amount = 250
            let range = 1000

            this.instanciateRandomly(Prefabs.Tree, amount, range)
            // this.instanciateRandomly(Prefabs.DeadTree, amount, range)
            // this.instanciateRandomly(Prefabs.Stone, amount, range)
            // this.instanciateRandomly(Prefabs.smallStone, amount, range)
            // this.instanciateRandomly(Prefabs.Tree, 1, 2)


            // AssetManager.load('https://hitpuzzle.b-cdn.net/SolSeat_VR_00075_joined2.glb')
            // AssetManager.load('https://hitpuzzle.b-cdn.net/06627.glb')
            // AssetManager.load('https://hitpuzzle.b-cdn.net/LOWPOLY1%20(1).glb')

        //     const trees: { entity: Entity, tree: Tree, state: 'DRAWN' | 'NEW' | 'DELETED' }[] = []
        //     const forestGenerator = new ForestGenerator(range, range, 10)

        //     forestGenerator.generateBaseForest()
        //     forestGenerator.iterate()


        //     const addTree = (tree: Tree) => {

        //         let prefab = Prefabs.Tree()

        //         trees.push({
        //             entity: prefab,
        //             tree: tree,
        //             state: 'DRAWN'
        //         })

        //         let transform = prefab.getComponent<TransformationComponent>(EComponent.TRANSFORMATION)
                
        //         if (transform) {
                    
        //             transform.position.set(tree.position.x, 0, tree.position.y)
        //             transform.needsUpdate = true
        //         }
                
        //         let graphics = prefab.getComponent<GraphicsComponent>(EComponent.GRAPHICS)
                
        //         const m = graphics.object as THREE.Mesh
                
        //         m.geometry.dispose()
        //         m.geometry = new THREE.BoxGeometry(tree.diameter, tree.height, tree.diameter)
        //     }

        //     for (let t of forestGenerator.getTrees()) {
                
        //         addTree(t)
        //     }


        //     const appylNextGeneration = () => {

        //         for (let tree of trees) {

        //             Game.world.removeEntity(tree.entity)
        //         }

        //         for (let t of forestGenerator.getTrees()) {
                    
        //             addTree(t)
        //         }

        //         for(let s of Game.world.systems) s.initialize()
        //     }

        //     setInterval(() => {

        //         forestGenerator.iterate()

        //         appylNextGeneration()

        //     }, 4000)

            resolve(null)

        })
    }

    disposeAssets() {

        for (let a of AssetManager.assets.values()) {

            Utils.dispose(a.scene)
        }

        Utils.dispose(Game.world.scene)
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

        this.onDestroy.next(null)
    }
}