import * as THREE from 'three'
import * as Stats from 'stats.js'
import * as Tone from 'tone'

import { Globals } from '../globals'

import { FirstPersonControllerSystem } from '../../core/systems/third-person-controller-system'
import { AnimationSystem } from '../../core/systems/animation-system'
import { AudioSystem } from '../../core/systems/audio-system'
import { RenderSystem } from '../../core/systems/render-system'
import { ScriptSystem } from '../../core/systems/script-system'

import { ECS } from '../../core/ecs'
import { RenderManager } from '../client/render-manager'
import { MeshBVH } from 'three-mesh-bvh'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'
import { rtMaterial as RT_MATERIAL } from "../shared/data/material";
import { GraphicsComponent } from '../core/components/graphics-component'
import { TransformationComponent } from '../../core/components/transformation-component'
import { Entity } from '../../core/entity'
import { AudioListenerComponent } from '../../core/components/audio-listener-component'
import { Input } from '../../shared/input'
import { Prefabs } from '../../shared/data/prefabs'
import { AssetManager } from '../../shared/asset-manager'
import { Utils } from '../../shared/util/utils'


export class Game {

    static i: Game

    public dom: HTMLElement

    public ecs: ECS

    public manager: RenderManager

    public static master: Tone.Volume

    private updateClock: THREE.Clock
    private fixedUpdateClock: THREE.Clock

    private backgroundColor = 0xffFF00 // ffe5b9 0xf4eedb 0xffe800
    
    private AFID: number

    private stats: Stats

    constructor(dom: HTMLElement) {

        Game.i = this

        this.dom = dom

        // Window data
        Globals.w = window.innerWidth
        Globals.h = window.innerHeight
        Globals.ratio = window.devicePixelRatio

        // Init ECS
        this.ecs = new ECS()

        // Init RenderManager
        this.manager = new RenderManager()
        this.dom.append(this.manager.renderer.domElement)
        this.manager.scene.fog = new THREE.Fog(this.backgroundColor, 1, 500)

        new Input(this.dom)


        // Init Tonejs Master
        Game.master = new Tone.Volume(-2)
        Game.master.toDestination()


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
        this.manager.scene.add(dLight)
        this.manager.scene.add(new THREE.HemisphereLight(0xf4eedb, 0xf4eedb, .7))


        const ground = this.ecs.createEntity()

        let m = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), RT_MATERIAL())
        m.geometry.rotateX(-Math.PI / 2)
        m.position.setY(-.01)
        m.receiveShadow = true
        this.ecs.addComponent(ground, new GraphicsComponent(m))

        // WebGL1 safety: enable frag-depth extension
        // rtMaterial.extensions = { fragDepth: true };
        const rtQuad = new FullScreenQuad( m.material )
        m.geometry.computeVertexNormals();
        const bvh = new MeshBVH(m.geometry);
        m.geometry.boundsTree = bvh
        m.userData.rtQuad = rtQuad

        if (Globals.debug) {

            this.stats = new Stats()
            this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom)
        }
    }

    init() {
        console.log('INIT')

        // Create Player
        let player = Prefabs.ControllablePlayer()

        this.fixedUpdateClock = new THREE.Clock()
        this.updateClock = new THREE.Clock()

        this.loadAssets().then(() => {

            return new Promise((resolve) => {
                
                this.ecs.registerSystem(new FirstPersonControllerSystem())
                this.ecs.registerSystem(new AnimationSystem())
                this.ecs.registerSystem(new RenderSystem(this.ecs, this.manager))

                const audioListener = this.ecs.getComponent<AudioListenerComponent>(player, AudioListenerComponent) as AudioListenerComponent
                this.ecs.registerSystem(new AudioSystem(audioListener))

                this.ecs.registerSystem(new ScriptSystem())

                this.loop()

                console.log('LOADED')
                resolve(null)
            })
        })
    }

    private instanciateRandomly(instaciateFunc: () => Entity, amount: number, range: number) {

        for (let i = 0; i < amount; i++) {

            let prefab = instaciateFunc()
            let transform = this.ecs.getComponent<TransformationComponent>(prefab, TransformationComponent)

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

        Tone.Destination.volume.exponentialRampTo(0, .5)
    }

    stop() {

        Tone.Transport.stop()
    }

    private isMuted: boolean = false
    private stored_volume: number = -20
    toggleMute(m?: boolean) {

        if (m == undefined) m = !this.isMuted

        if (!this.isMuted) this.stored_volume = Game.master.volume.value

        this.isMuted = m

        this.mute(this.isMuted)
    }

    mute(active: boolean) {

        this.isMuted = active

        if (!this.isMuted) this.stored_volume = Game.master.volume.value

        if (active) {

            setTimeout(() => {

                Game.master.mute = true
                Tone.Destination.mute = true
                Game.master.volume.setValueAtTime(Number.NEGATIVE_INFINITY, Tone.context.currentTime)

            }, 200)

            Game.master.volume.linearRampToValueAtTime(-80, Tone.context.currentTime + .2)
        }
        else {
            
            Game.master.mute = false
            Tone.Destination.mute = false
            Game.master.volume.linearRampToValueAtTime(this.stored_volume, Tone.context.currentTime + .2)
        }
    }

    update() {

        this.ecs.update(this.updateClock.getDelta())

        this.manager.render()
    }

    private fixedUpdateTiming: number = 20;
    private physicsTimeSimulated: number = Date.now();
    // private _deltaTime: number = 0;
    // private lastUpdate: number = Date.now();

    fixedUpdate() {

        while (this.physicsTimeSimulated < Date.now()) {

            this.physicsTimeSimulated += this.fixedUpdateTiming;

            // Game.world.fixedUpdate(this.fixedUpdateClock.getDelta())
        }

        // this._deltaTime = Date.now() - this.lastUpdate;
        // console.log('fix delta',this._deltaTime)
        // this.lastUpdate = Date.now();
    }

    loop() {

        if (Globals.debug) this.stats.begin()

        this.update()
        // this.fixedUpdate()

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


            this.instanciateRandomly(Prefabs.Tree, 1, 20)
            // this.instanciateRandomly(Prefabs.Stone, 1, 20)

            // this.instanciateRandomly(Prefabs.Tree, 200, 500)
            // this.instanciateRandomly(Prefabs.DeadTree, 20, 500)
            // this.instanciateRandomly(Prefabs.Stone, 200, 500)
            // this.instanciateRandomly(Prefabs.smallStone, 100, 500)


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

        Utils.dispose(this.manager.scene)
    }

    resize() {

        Globals.w = window.innerWidth
        Globals.h = window.innerHeight
        Globals.ratio = window.devicePixelRatio

        this.manager.renderer.setSize(Globals.w, Globals.h)
        this.manager.renderer.setPixelRatio(Globals.ratio)

        this.manager.camera.aspect = Globals.w / Globals.h
        this.manager.camera.updateProjectionMatrix()
    }

    destroy() {

        this.stop()

        this.disposeAssets()
    }
}