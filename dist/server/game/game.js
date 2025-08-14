"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const THREE = __importStar(require("three"));
const Stats = __importStar(require("stats.js"));
const Tone = __importStar(require("tone"));
const globals_1 = require("../globals");
const asset_manager_1 = require("../shared/asset-manager");
const input_1 = require("../shared/input");
const prefabs_1 = require("../shared/data/prefabs");
const utils_1 = require("../shared/util/utils");
const third_person_controller_system_1 = require("../../ecs/systems/third-person-controller-system");
const animation_system_1 = require("../../ecs/systems/animation-system");
const audio_system_1 = require("../../ecs/systems/audio-system");
const render_system_1 = require("../../ecs/systems/render-system");
const script_system_1 = require("../../ecs/systems/script-system");
const ecs_1 = require("../../ecs/ecs");
const render_manager_1 = require("../client/render-manager");
const transformation_component_1 = require("../../ecs/components/transformation-component");
const audio_listener_component_1 = require("../../ecs/components/audio-listener-component");
class Game {
    constructor(dom) {
        this.backgroundColor = 0xffFF00; // ffe5b9 0xf4eedb 0xffe800
        this.isMuted = false;
        this.stored_volume = -20;
        this.fixedUpdateTiming = 20;
        this.physicsTimeSimulated = Date.now();
        Game.i = this;
        this.dom = dom;
        // Window data
        globals_1.Globals.w = window.innerWidth;
        globals_1.Globals.h = window.innerHeight;
        globals_1.Globals.ratio = window.devicePixelRatio;
        // Init ECS
        this.ecs = new ecs_1.ECS();
        // Init RenderManager
        this.manager = new render_manager_1.RenderManager();
        this.dom.append(this.manager.renderer.domElement);
        this.manager.scene.fog = new THREE.Fog(this.backgroundColor, 1, 500);
        new input_1.Input(this.dom);
        // Init Tonejs Master
        Game.master = new Tone.Volume(-2);
        Game.master.toDestination();
        // Cubemap
        const cubeMap = new THREE.CubeTextureLoader()
            .setPath(globals_1.Globals.path + 'assets/images/cubemap/')
            .load([
            'px.png',
            'nx.png',
            'py.png',
            'ny.png',
            'pz.png',
            'nz.png'
        ]);
        // Game.scene.background = cubeMap
        // Game.scene.add(new THREE.GridHelper(1000, 1000))
        let dLight = new THREE.DirectionalLight(0xf4eedb, .8);
        dLight.position.set(50, 50, 50);
        dLight.castShadow = true;
        dLight.shadow.camera.far = 200;
        dLight.shadow.camera.near = .1;
        dLight.shadow.camera.top = 200;
        dLight.shadow.camera.bottom = -200;
        dLight.shadow.camera.left = -200;
        dLight.shadow.camera.right = 200;
        dLight.shadow.mapSize.width = 4096;
        dLight.shadow.mapSize.height = 4096;
        this.manager.scene.add(dLight);
        this.manager.scene.add(new THREE.HemisphereLight(0xf4eedb, 0xf4eedb, .7));
        let ground = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
        ground.geometry.rotateX(-Math.PI / 2);
        ground.position.setY(-.01);
        ground.receiveShadow = true;
        this.manager.scene.add(ground);
        if (globals_1.Globals.debug) {
            this.stats = new Stats();
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);
        }
    }
    init() {
        console.log('INIT');
        // Create Player
        let player = prefabs_1.Prefabs.ControllablePlayer();
        this.fixedUpdateClock = new THREE.Clock();
        this.updateClock = new THREE.Clock();
        this.loadAssets().then(() => {
            return new Promise((resolve) => {
                this.ecs.registerSystem(new third_person_controller_system_1.FirstPersonControllerSystem());
                this.ecs.registerSystem(new animation_system_1.AnimationSystem());
                this.ecs.registerSystem(new render_system_1.RenderSystem(this.ecs, this.manager));
                const audioListener = this.ecs.getComponent(player, audio_listener_component_1.AudioListenerComponent);
                this.ecs.registerSystem(new audio_system_1.AudioSystem(audioListener));
                this.ecs.registerSystem(new script_system_1.ScriptSystem());
                this.loop();
                console.log('LOADED');
                resolve(null);
            });
        });
    }
    instanciateRandomly(instaciateFunc, amount, range) {
        for (let i = 0; i < amount; i++) {
            let prefab = instaciateFunc();
            let transform = this.ecs.getComponent(prefab, transformation_component_1.TransformationComponent);
            if (transform) {
                transform.position.set((Math.random() * range) - (range / 2), 0, (Math.random() * range) - (range / 2));
                transform.rotation.set(0, (Math.random() * 2 * Math.PI), 0);
                transform.needsUpdate = true;
            }
        }
    }
    start() {
        Tone.Transport.start();
        Tone.Destination.volume.exponentialRampTo(0, .5);
    }
    stop() {
        Tone.Transport.stop();
    }
    toggleMute(m) {
        if (m == undefined)
            m = !this.isMuted;
        if (!this.isMuted)
            this.stored_volume = Game.master.volume.value;
        this.isMuted = m;
        this.mute(this.isMuted);
    }
    mute(active) {
        this.isMuted = active;
        if (!this.isMuted)
            this.stored_volume = Game.master.volume.value;
        if (active) {
            setTimeout(() => {
                Game.master.mute = true;
                Tone.Destination.mute = true;
                Game.master.volume.setValueAtTime(Number.NEGATIVE_INFINITY, Tone.context.currentTime);
            }, 200);
            Game.master.volume.linearRampToValueAtTime(-80, Tone.context.currentTime + .2);
        }
        else {
            Game.master.mute = false;
            Tone.Destination.mute = false;
            Game.master.volume.linearRampToValueAtTime(this.stored_volume, Tone.context.currentTime + .2);
        }
    }
    update() {
        this.ecs.update(this.updateClock.getDelta());
        this.manager.render();
    }
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
        if (globals_1.Globals.debug)
            this.stats.begin();
        this.update();
        // this.fixedUpdate()
        if (globals_1.Globals.debug)
            this.stats.end();
        window.cancelAnimationFrame(this.AFID);
        this.AFID = window.requestAnimationFrame(this.loop.bind(this));
    }
    loadAssets() {
        return new Promise(resolve => {
            asset_manager_1.AssetManager.onload = () => {
                console.log('Load fin');
                resolve(null);
            };
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
            // this.instanciateRandomly(Prefabs.Tree, 5, 20)
            // this.instanciateRandomly(Prefabs.Stone, 1, 20)
            this.instanciateRandomly(prefabs_1.Prefabs.Tree, 200, 500);
            // this.instanciateRandomly(Prefabs.DeadTree, 20, 500)
            this.instanciateRandomly(prefabs_1.Prefabs.Stone, 200, 500);
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
            resolve(null);
        });
    }
    disposeAssets() {
        for (let a of asset_manager_1.AssetManager.assets.values()) {
            utils_1.Utils.dispose(a.scene);
        }
        utils_1.Utils.dispose(this.manager.scene);
    }
    resize() {
        globals_1.Globals.w = window.innerWidth;
        globals_1.Globals.h = window.innerHeight;
        globals_1.Globals.ratio = window.devicePixelRatio;
        this.manager.renderer.setSize(globals_1.Globals.w, globals_1.Globals.h);
        this.manager.renderer.setPixelRatio(globals_1.Globals.ratio);
        this.manager.camera.aspect = globals_1.Globals.w / globals_1.Globals.h;
        this.manager.camera.updateProjectionMatrix();
    }
    destroy() {
        this.stop();
        this.disposeAssets();
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map