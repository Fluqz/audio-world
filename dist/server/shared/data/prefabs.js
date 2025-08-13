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
exports.Prefabs = void 0;
const THREE = __importStar(require("three"));
const Tone = __importStar(require("tone"));
const note_frequencies_1 = require("./note-frequencies");
const game_1 = require("../../game/game");
const utils_1 = require("../util/utils");
const trace_script_1 = require("./scripts/trace.script");
const sample_db_1 = require("./sample-db");
const asset_manager_1 = require("../asset-manager");
const animation_component_1 = require("../../../core/components/animation-component");
const audio_component_1 = require("../../../core/components/audio-component");
const audio_listener_component_1 = require("../../../core/components/audio-listener-component");
const audio_source_component_1 = require("../../../core/components/audio-source-component");
const graphics_component_1 = require("../../../core/components/graphics-component");
const script_component_1 = require("../../../core/components/script-component");
const tag_component_1 = require("../../../core/components/tag-component");
const third_person_controller_component_1 = require("../../../core/components/third-person-controller-component");
const transformation_component_1 = require("../../../core/components/transformation-component");
const material_1 = require("../data/material");
let texture = new THREE.TextureLoader().load('assets//image2.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
exports.Prefabs = {
    Player: () => {
        const ecs = game_1.Game.i.ecs;
        let c = utils_1.Utils.getRndColor();
        let t = new transformation_component_1.TransformationComponent();
        let m = new THREE.Mesh(new THREE.SphereGeometry(.3, 32, 32), new THREE.MeshStandardMaterial({ color: c }));
        m.geometry.translate(0, m.geometry.parameters.radius / 2, 0);
        m.castShadow = true;
        m.receiveShadow = true;
        const e = ecs.createEntity();
        ecs.addComponent(e, new tag_component_1.TagComponent('Player'));
        ecs.addComponent(e, t);
        ecs.addComponent(e, new graphics_component_1.GraphicsComponent(m));
        ecs.addComponent(e, new audio_listener_component_1.AudioListenerComponent(t));
        return e;
    },
    ControllablePlayer: () => {
        const ecs = game_1.Game.i.ecs;
        const e = ecs.createEntity();
        // ecs.addComponent(e, new TagComponent('ControllablePlayer'))
        ecs.addTag(e, 'ControllablePlayer');
        const t = new transformation_component_1.TransformationComponent();
        t.position.y = .3;
        t.needsUpdate = true;
        ecs.addComponent(e, t);
        let m = new THREE.Mesh(new THREE.SphereGeometry(.3, 32, 32), new THREE.MeshToonMaterial());
        m.geometry.translate(0, 0, 0);
        m.castShadow = true;
        m.receiveShadow = true;
        ecs.addComponent(e, new graphics_component_1.GraphicsComponent(m));
        ecs.addComponent(e, new audio_listener_component_1.AudioListenerComponent(t));
        ecs.addComponent(e, new script_component_1.ScriptComponent(new trace_script_1.TraceScript()));
        ecs.addComponent(e, new third_person_controller_component_1.ThirdPersonControllerComponent(game_1.Game.i.manager.camera, game_1.Game.i.dom));
        return e;
    },
    /* Environment */
    Tree: () => {
        const ecs = game_1.Game.i.ecs;
        const e = ecs.createEntity();
        ecs.addComponent(e, new tag_component_1.TagComponent('Tree'));
        let s = (Math.random() * 4) + .7;
        let m = new THREE.Mesh(new THREE.BoxGeometry(s, Math.random() * 99, s), (0, material_1.faceDisplacementShader)(1, 0x000000).clone());
        m.geometry.translate(0, (m.geometry.parameters.height / 2) - s, 0);
        // let r = (Math.PI / 16)
        // m.geometry.rotateX((Math.random() * r) - r)
        // m.geometry.rotateZ((Math.random() * r) - r)
        m.castShadow = true;
        ecs.addComponent(e, new graphics_component_1.GraphicsComponent(m));
        ecs.addComponent(e, new transformation_component_1.TransformationComponent());
        // ecs.addComponent(new BoundingboxComponent())
        ecs.addComponent(e, new animation_component_1.AnimationComponent((e, transform) => {
            transform.scale.x = Math.sin(Tone.context.currentTime) + 1.8;
            transform.scale.y = Math.cos(Tone.context.currentTime) + 2;
            transform.scale.z = Math.sin(Tone.context.currentTime) + 1.8;
            transform.needsUpdate = true;
        }));
        const type = ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)];
        let sourceOptions = {
            frequency: (0, note_frequencies_1.getScale)((0, note_frequencies_1.getNote)('F' + Math.round((Math.random() * 3) + 1)), note_frequencies_1.CUSTOM_SCALE)[Math.round(Math.random() * note_frequencies_1.CUSTOM_SCALE.length)].frequency,
            type: type //'sine'
        };
        const o = new Tone.Oscillator(sourceOptions);
        o.start();
        ecs.addComponent(e, new audio_component_1.AudioComponent(new audio_source_component_1.AudioSourceComponent(o, .5, 0), undefined, 100));
        // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))
        return e;
    },
    RealTree: () => {
        const ecs = game_1.Game.i.ecs;
        const e = ecs.createEntity();
        ecs.addComponent(e, new tag_component_1.TagComponent('Tree'));
        let m;
        asset_manager_1.AssetManager.load('/assets/models/Tree' + (Math.round(Math.random() * 2) + 1) + '.glb').then(glb => {
            console.log('TREE LOADED', glb);
            m = glb.scene;
            let r = (Math.PI / 8);
            m.rotateX((Math.random() * r) - r);
            m.rotateZ((Math.random() * r) - r);
            const g = ecs.getComponent(e, graphics_component_1.GraphicsComponent);
            g.object.add(glb.scene);
        });
        ecs.addComponent(e, new graphics_component_1.GraphicsComponent(new THREE.Object3D()));
        ecs.addComponent(e, new transformation_component_1.TransformationComponent());
        // ecs.addComponent(e, new BoundingboxComponent())
        ecs.addComponent(e, new animation_component_1.AnimationComponent((e, transform) => {
            // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
            // transform.scale.y = Math.cos(Tone.context.currentTime) + 2
            // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
            transform.rotation.y = Math.sin(Tone.context.currentTime / 10);
            transform.needsUpdate = true;
        }));
        const type = ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)];
        let sourceOptions = {
            frequency: (0, note_frequencies_1.getScale)((0, note_frequencies_1.getNote)('F' + Math.round((Math.random() * 3) + 1)), note_frequencies_1.AEOLIAN_SCALE)[Math.round(Math.random() * note_frequencies_1.AEOLIAN_SCALE.length)].frequency,
            type: type //'sine'
        };
        ecs.addComponent(e, new audio_component_1.AudioComponent(new audio_source_component_1.AudioSourceComponent(new Tone.Oscillator(sourceOptions), .5, -10), undefined, 100));
        // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))
        return e;
    },
    Stone: () => {
        const ecs = game_1.Game.i.ecs;
        const e = ecs.createEntity();
        ecs.addComponent(e, new tag_component_1.TagComponent('Stone'));
        const max = 10;
        let m = new THREE.Mesh(new THREE.BoxGeometry(Math.random() * max, Math.random() * max, Math.random() * max), (0, material_1.faceDisplacementShader)(1, 0x000000).clone());
        m.castShadow = true;
        m.receiveShadow = true;
        // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8);
        m.geometry.rotateX((Math.random() * r) - r);
        m.geometry.rotateZ((Math.random() * r) - r);
        ecs.addComponent(e, new graphics_component_1.GraphicsComponent(m));
        ecs.addComponent(e, new transformation_component_1.TransformationComponent());
        ecs.addComponent(e, new animation_component_1.AnimationComponent((e, transform) => {
            // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
            transform.scale.y = Math.cos(Tone.context.currentTime) + 2;
            // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
            transform.needsUpdate = true;
        }));
        const sample = sample_db_1.drum_fills_samples[Math.round(Math.random() * sample_db_1.drum_fills_samples.length - 1)];
        const player = new Tone.Player(sample);
        player.autostart = true;
        player.loop = true;
        ecs.addComponent(e, new audio_component_1.AudioComponent(new audio_source_component_1.AudioSourceComponent(player, .1, -10), undefined, 100));
        // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))
        return e;
    },
    smallStone: () => {
        const ecs = game_1.Game.i.ecs;
        const e = ecs.createEntity();
        ecs.addComponent(e, new tag_component_1.TagComponent('SmallStone'));
        const max = 1;
        // let m = new THREE.Mesh(new THREE.SphereGeometry(Math.random() * max, 64, 64), defShaderMaterial(1, 0x000000).clone())
        let m = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random() * max, 0), (0, material_1.faceDisplacementShader)(1, 0x000000).clone());
        m.castShadow = true;
        m.receiveShadow = true;
        // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8);
        m.geometry.rotateX((Math.random() * r) - r);
        m.geometry.rotateZ((Math.random() * r) - r);
        ecs.addComponent(e, new graphics_component_1.GraphicsComponent(m));
        ecs.addComponent(e, new transformation_component_1.TransformationComponent());
        ecs.addComponent(e, new animation_component_1.AnimationComponent((e, transform) => {
            // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
            transform.scale.y = Math.cos(Tone.context.currentTime) + 2;
            // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
            transform.needsUpdate = true;
        }));
        const sample = sample_db_1.factory_samples[Math.round(Math.random() * sample_db_1.factory_samples.length - 1)];
        const player = new Tone.Player(sample);
        player.autostart = true;
        player.loop = true;
        ecs.addComponent(e, new audio_component_1.AudioComponent(new audio_source_component_1.AudioSourceComponent(player, .1, -10), undefined, 100));
        // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))
        return e;
    },
    DeadTree: () => {
        const ecs = game_1.Game.i.ecs;
        const e = ecs.createEntity();
        ecs.addComponent(e, new tag_component_1.TagComponent('DeadTree'));
        let s = (Math.random() * 3) + .7;
        let m = new THREE.Mesh(new THREE.BoxGeometry(s, Math.random() * 49, s), (0, material_1.faceDisplacementShader)(1, 0x000000).clone());
        m.geometry.translate(0, m.geometry.parameters.height / 2, 0);
        let r = (Math.PI / 8);
        m.geometry.rotateY((Math.random() * r) - r);
        m.geometry.rotateZ((Math.random() * Math.PI) - Math.PI);
        m.geometry.rotateX(Math.PI / 2);
        ecs.addComponent(e, new graphics_component_1.GraphicsComponent(m));
        ecs.addComponent(e, new transformation_component_1.TransformationComponent());
        ecs.addComponent(e, new animation_component_1.AnimationComponent((e, transform) => {
            // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
            transform.scale.y = Math.cos(Tone.context.currentTime) + 2;
            // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
            transform.needsUpdate = true;
        }));
        let sourceOptions = {
            frequency: (0, note_frequencies_1.getScale)((0, note_frequencies_1.getNote)('F' + Math.round((Math.random() * 3) + 1)), note_frequencies_1.AEOLIAN_SCALE)[Math.round(Math.random() * note_frequencies_1.AEOLIAN_SCALE.length)].frequency,
            type: 'sine'
        };
        ecs.addComponent(e, new audio_component_1.AudioComponent(new audio_source_component_1.AudioSourceComponent(new Tone.Oscillator(sourceOptions), .5, -10), undefined, 100));
        // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))
        return e;
    }
};
//# sourceMappingURL=prefabs.js.map