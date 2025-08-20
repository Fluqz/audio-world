import * as THREE from 'three'
import * as Stats from 'stats.js'
import * as Tone from 'tone'

import { Globals } from '../globals'

import { AnimationSystem } from '../ecs/systems/animation-system'
import { AudioSystem } from '../ecs/systems/audio-system'
import { RenderSyncSystem } from '../ecs/systems/render-sync-system'
import { ScriptSystem } from '../ecs/systems/script-system'

import { ECS } from '../ecs/ecs'
import { RenderManager } from './render-manager'
import { TransformationComponent } from '../ecs/components/transformation-component'
import { Entity } from '../ecs/entity'
import { Input } from '../shared/input'
import { Prefabs } from '../shared/data/prefabs'
import { AssetManager } from '../shared/asset-manager'
import { Utils } from '../shared/util/utils'
import { Octree } from '../ecs/octree'
import { PhysicsSystem } from '../ecs/systems/physics-system'
import { SpatialSystem } from '../ecs/systems/spatial-system'
import { Scene } from '../ecs/scene'
import { SceneManager } from './scene-manager'
import { defaultActionMap, InputSystem } from '../ecs/systems/input-system'
import { ThirdPersonMovementSystem } from '../ecs/systems/third-person-movement-system'
import { CameraFollowSystem } from '../ecs/systems/camera-follow-system'


export class Game {

    static i: Game

    public dom: HTMLElement

    public ecs: ECS
    public octree: Octree

    public player: Entity

    public sceneManager: SceneManager

    public renderManager: RenderManager

    public static master: Tone.Volume

    private updateClock: THREE.Clock
    private fixedUpdateClock: THREE.Clock
    private backgroundColor = 0xffe800 // ffe5b9 0xf4eedb 0xffe800
    
    private AFID: number

    private stats: Stats

    constructor(dom: HTMLElement) {

        Game.i = this

        this.dom = dom

        // Window data
        Globals.w = window.innerWidth
        Globals.h = window.innerHeight
        Globals.ratio = window.devicePixelRatio

        this.octree = new Octree(new THREE.Vector3(-500, -500, -500), new THREE.Vector3(500, 500, 500))
        
        this.sceneManager = new SceneManager()

        // Init RenderManager
        this.renderManager = new RenderManager()
        this.dom.append(this.renderManager.renderer.domElement)
        this.renderManager.scene.fog = new THREE.Fog(this.backgroundColor, 1, 500)

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
        this.renderManager.scene.add(dLight)
        this.renderManager.scene.add(new THREE.HemisphereLight(0xf4eedb, 0xf4eedb, .7))

        let ground = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), new THREE.MeshStandardMaterial({ color: 0xff0000 }))
        ground.geometry.rotateX(-Math.PI / 2)
        ground.position.setY(-.01)
        ground.receiveShadow = true
        this.renderManager.scene.add(ground)

        if (Globals.debug) {

            this.stats = new Stats()
            this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom)
        }
    }

    init() {

        this.fixedUpdateClock = new THREE.Clock()
        this.updateClock = new THREE.Clock()

        if(this.activeScene) this.activeScene.unload()
        
        const scene = new Scene('scene1.json')
        this.ecs = scene.ecs

        // Create Player
        this.player = Prefabs.Player(scene.ecs)
        // this.sceneManager.loadScene(Globals.path + '/assets/scenes/scene1.json')

        this.instanciateRandomly(Prefabs.Stone, 5, 20)

        for(let e of this.ecs.entities.keys()) {

            for(let comp of this.ecs.getAllComponents(e)) {
                
                if(comp.resolveReferences) comp.resolveReferences(this.ecs)
            }
        }
        
        
        this.registerSystems()
        
        this.loop()
    }

    instanciatePrefab() {

    }

    registerSystems() {

        if(!this.ecs) return 

        // Inputs
        this.ecs.registerSystem(new InputSystem(defaultActionMap))
        // Player Controller
        this.ecs.registerSystem(new ThirdPersonMovementSystem(this.renderManager.camera))
        // Physics
        this.ecs.registerSystem(new PhysicsSystem())
        // Octree
        this.ecs.registerSystem(new SpatialSystem(this.octree))
        // Camera Follow
        this.ecs.registerSystem(new CameraFollowSystem(this.renderManager.orbit))
        this.ecs.registerSystem(new AnimationSystem())

        
        this.ecs.registerSystem(new RenderSyncSystem(this.ecs))
        
        this.ecs.registerSystem(new ScriptSystem())
        this.ecs.registerSystem(new AudioSystem(this.octree))
    }

    public activeScene: Scene
    setActiveScene(scene: Scene) {

        this.activeScene = scene
    }

    private instanciateRandomly(instaciateFunc: (...args) => Entity, amount: number, range: number) {

        for (let i = 0; i < amount; i++) {

            let prefab = instaciateFunc(this.ecs)


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
            }
        }
    }

    start() {

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

        this.renderManager.render()
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







            // AssetManager.onload = () => {
            //     console.log('Load fin')
            //     resolve(null)
            // }

            // this.instanciateRandomly(Prefabs.Tree, 50, 80)
            // this.instanciateRandomly(Prefabs.Tree, 1, 50)
            // this.instanciateRandomly(Prefabs.Stone, 1, 50)
            // this.instanciateRandomly(Prefabs.crystal, 1, 50)
            // this.instanciateRandomly(Prefabs.DeadTree, 1, 50)

            // const treeJSON = this.ecs.loadPrefabFile(Globals.path + '/assets/prefabs/tree.json')

            // const treePrefab: Prefab = JSON.parse(treeJSON)

            // this.ecs.createFromPrefab(treePrefab)

            // this.instanciateRandomly(Prefabs.Tree, 200, 500)
            // this.instanciateRandomly(Prefabs.DeadTree, 20, 500)
            // this.instanciateRandomly(Prefabs.Stone, 200, 500)
            // this.instanciateRandomly(Prefabs.crystal, 100, 500)

            resolve(null)

        })
    }

    disposeAssets() {

        for (let a of AssetManager.assets.values()) {

            Utils.dispose(a.scene)
        }

        Utils.dispose(this.renderManager.scene)
    }

    resize() {

        Globals.w = window.innerWidth
        Globals.h = window.innerHeight
        Globals.ratio = window.devicePixelRatio

        this.renderManager.resize(Globals.w, Globals.h, Globals.ratio)
    }

    destroy() {

        this.stop()

        this.disposeAssets()
    }
}