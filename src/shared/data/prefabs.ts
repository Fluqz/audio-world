import * as THREE from "three";
import * as Tone from "tone";
import { getScale, getNote, AEOLIAN_SCALE, DORIAN_SCALE, CUSTOM_SCALE } from "./note-frequencies";
import { Game } from "../../game/game";
import { AffectionScript } from "./scripts/affection.script";
import { Utils } from "../util/utils";
import { TraceScript } from "./scripts/trace.script";

import { drum_fills_samples, factory_samples } from './sample-db'
import { AssetManager } from "../asset-manager";
import { AnimationComponent } from "../../core/components/animation-component";
import { AudioComponent } from "../../core/components/audio-component";
import { AudioListenerComponent } from "../../core/components/audio-listener-component";
import { AudioSourceComponent } from "../../core/components/audio-source-component";
import { GraphicsComponent } from "../../core/components/graphics-component";
import { ScriptComponent } from "../../core/components/script-component";
import { TagComponent } from "../../core/components/tag-component";
import { ThirdPersonControllerComponent } from "../../core/components/third-person-controller-component";
import { TransformationComponent } from "../../core/components/transformation-component";
import { Entity } from "../../core/entity";


const material = new THREE.MeshStandardMaterial({

    color: 0x000000,
    roughness: 0,
    metalness: 1
})


let texture = new THREE.TextureLoader().load( 'assets//image2.png' )

texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping

let u = {

    'amplitude': { value: 1.0 },
    'color': { value: new THREE.Color( 0x000000 ) },
}



let shaderMaterial: THREE.Material = new THREE.ShaderMaterial({
    vertexShader: `

        uniform float amplitude;

        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {

            vNormal = normal;
            vUv = ( 0.5 + amplitude ) * uv + vec2( amplitude );

            vec3 newPosition = position + amplitude * normal * vec3( 0.02 );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }
    `,
    fragmentShader: `

        varying vec3 vNormal;
        varying vec2 vUv;

        uniform vec3 color;

        void main() {

            vec3 light = vec3( 0.5, 0.2, 1.0 );
            light = normalize( light );

            float dProd = dot( vNormal, light ) * 0.5 + 0.5;

            gl_FragColor = vec4( vec3( dProd ) * vec3( color ), 1.0 );

        }
    `,
    uniforms: {

		time: { value: 1.0 },
		resolution: { value: new THREE.Vector2() },
        amplitude: u.amplitude,
        color: u.color,
    }
})

// shaderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })

export const Prefabs = {

    Player: () => {

        const ecs = Game.i.ecs

        let c = Utils.getRndColor()

        let t = new TransformationComponent()
        let m = new THREE.Mesh(new THREE.SphereGeometry(.3, 32, 32), new THREE.MeshStandardMaterial({ color: c }))
        m.geometry.translate(0, m.geometry.parameters.radius / 2, 0)

        const e = ecs.createEntity()
        
        ecs.addComponent(e, new TagComponent('Player'))
        ecs.addComponent(e, t)
        ecs.addComponent(e, new GraphicsComponent(m))
        ecs.addComponent(e, new AudioListenerComponent(t))

        return e
    },

    ControllablePlayer: () => {

        const ecs = Game.i.ecs

        const e = ecs.createEntity()
        // ecs.addComponent(e, new TagComponent('ControllablePlayer'))

        ecs.addTag(e, 'ControllablePlayer')

        const t = new TransformationComponent()
        t.position.y = .3
        t.needsUpdate = true
        ecs.addComponent(e, t)

        let m = new THREE.Mesh(new THREE.SphereGeometry(.3, 32, 32), new THREE.MeshNormalMaterial())
        m.geometry.translate(0, 0, 0)
        ecs.addComponent(e, new GraphicsComponent(m))

        ecs.addComponent(e, new AudioListenerComponent(t))
        ecs.addComponent(e, new ScriptComponent(new TraceScript()))
        ecs.addComponent(e, new ThirdPersonControllerComponent(Game.i.manager.camera, Game.i.dom))

        return e
    },



    /* Environment */

    Tree: () => {

        const ecs = Game.i.ecs

        const e = ecs.createEntity()
        ecs.addComponent(e, new TagComponent('Tree'))

        let s = (Math.random() * 4) + .7

        let m = new THREE.Mesh(new THREE.BoxGeometry(s, Math.random() * 99, s), shaderMaterial.clone())
        m.geometry.translate(0, (m.geometry.parameters.height / 2) - s, 0)
        // let r = (Math.PI / 16)
        // m.geometry.rotateX((Math.random() * r) - r)
        // m.geometry.rotateZ((Math.random() * r) - r)
        m.castShadow = true

        ecs.addComponent(e, new GraphicsComponent(m))
        ecs.addComponent(e, new TransformationComponent())
        // ecs.addComponent(new BoundingboxComponent())
        ecs.addComponent(e, new AnimationComponent((e: Entity, transform: TransformationComponent) => {

            transform.scale.x = Math.sin(Tone.context.currentTime) + 1.8
            transform.scale.y = Math.cos(Tone.context.currentTime) + 2
            transform.scale.z = Math.sin(Tone.context.currentTime) + 1.8
            transform.needsUpdate = true
        }))

        const type = ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType

        let sourceOptions: OscillatorOptions = {
            frequency: getScale(getNote('F' + Math.round((Math.random() * 3) + 1)), CUSTOM_SCALE)[Math.round(Math.random() * CUSTOM_SCALE.length)].frequency,
            type: type //'sine'
        }
        const o = new Tone.Oscillator(sourceOptions)
        o.start()
        ecs.addComponent(e, new AudioComponent(new AudioSourceComponent(o, .5, 0), undefined, 100))
        // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))

        return e
    },

    RealTree: () => {

        const ecs = Game.i.ecs

        const e = ecs.createEntity()
        ecs.addComponent(e, new TagComponent('Tree'))

        let m
        AssetManager.load('/assets/models/Tree'+ (Math.round(Math.random() * 2) + 1) +'.glb').then(glb => {

            console.log('TREE LOADED', glb)

            m = glb.scene

            let r = (Math.PI / 8)
            m.rotateX((Math.random() * r) - r)
            m.rotateZ((Math.random() * r) - r)

            const g = ecs.getComponent<GraphicsComponent>(e, GraphicsComponent)
            g.object.add(glb.scene)
        })

        ecs.addComponent(e, new GraphicsComponent(new THREE.Object3D()))
        ecs.addComponent(e, new TransformationComponent())
        // ecs.addComponent(e, new BoundingboxComponent())
        ecs.addComponent(e, new AnimationComponent((e: Entity, transform: TransformationComponent) => {

            // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
            // transform.scale.y = Math.cos(Tone.context.currentTime) + 2
            // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5

            transform.rotation.y = Math.sin(Tone.context.currentTime / 10)
            transform.needsUpdate = true
        }))

        const type = ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType

        let sourceOptions: OscillatorOptions = {
            frequency: getScale(getNote('F' + Math.round((Math.random() * 3) + 1)), AEOLIAN_SCALE)[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency,
            type: type //'sine'
        }

        ecs.addComponent(e, new AudioComponent(new AudioSourceComponent(new Tone.Oscillator(sourceOptions), .5, -10), undefined, 100))
        // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))


        return e
    },


    Stone: () => {

        const ecs = Game.i.ecs
        const e = ecs.createEntity()
        ecs.addComponent(e, new TagComponent('Stone'))

        const max = 10
        let m = new THREE.Mesh(new THREE.BoxGeometry(Math.random() * max, Math.random() * max, Math.random() * max), shaderMaterial.clone())
        m.castShadow = true
        m.receiveShadow = true
        // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateX((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * r) - r)

        ecs.addComponent(e, new GraphicsComponent(m))
        ecs.addComponent(e, new TransformationComponent())
        ecs.addComponent(e, new AnimationComponent((e: Entity, transform: TransformationComponent) => {

            // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
            transform.scale.y = Math.cos(Tone.context.currentTime) + 2
            // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
            transform.needsUpdate = true
        }))


        const sample = drum_fills_samples[Math.round(Math.random() * drum_fills_samples.length - 1)]
        const player = new Tone.Player(sample)
        player.autostart = true
        player.loop = true

        ecs.addComponent(e, new AudioComponent(new AudioSourceComponent(player, .1, -10), undefined, 100))
        // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))

        return e
    },


    smallStone: () => {

        const ecs = Game.i.ecs
        const e = ecs.createEntity()
        ecs.addComponent(e, new TagComponent('SmallStone'))

        const max = 1
        // let m = new THREE.Mesh(new THREE.SphereGeometry(Math.random() * max, 64, 64), shaderMaterial.clone())
        let m = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random() * max, 0), shaderMaterial.clone())
        m.castShadow = true
        m.receiveShadow = true
        // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateX((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * r) - r)

        ecs.addComponent(e, new GraphicsComponent(m))
        ecs.addComponent(e, new TransformationComponent())
        ecs.addComponent(e, new AnimationComponent((e: Entity, transform: TransformationComponent) => {

            // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
            transform.scale.y = Math.cos(Tone.context.currentTime) + 2
            // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
            transform.needsUpdate = true
        }))


        const sample = factory_samples[Math.round(Math.random() * factory_samples.length - 1)]
        const player = new Tone.Player(sample)
        player.autostart = true
        player.loop = true

        ecs.addComponent(e, new AudioComponent(new AudioSourceComponent(player, .1, -10), undefined, 100))
        // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))

        return e
    },


    DeadTree: () => {

        const ecs = Game.i.ecs
        const e = ecs.createEntity()
        ecs.addComponent(e, new TagComponent('DeadTree'))

        let s = (Math.random() * 3) + .7

        let m = new THREE.Mesh(new THREE.BoxGeometry(s, Math.random() * 49, s), shaderMaterial.clone())
        m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateY((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * Math.PI) - Math.PI)
        m.geometry.rotateX(Math.PI / 2)

        ecs.addComponent(e, new GraphicsComponent(m))
        ecs.addComponent(e, new TransformationComponent())
        ecs.addComponent(e, new AnimationComponent((e: Entity, transform: TransformationComponent) => {

            // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
            transform.scale.y = Math.cos(Tone.context.currentTime) + 2
            // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
            transform.needsUpdate = true
        }))

        let sourceOptions: OscillatorOptions = {
            frequency: getScale(getNote('F' + Math.round((Math.random() * 3) + 1)), AEOLIAN_SCALE)[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency,
            type: 'sine'
        }

        ecs.addComponent(e, new AudioComponent(new AudioSourceComponent(new Tone.Oscillator(sourceOptions), .5, -10), undefined, 100))
        // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))

        return e
    }
}