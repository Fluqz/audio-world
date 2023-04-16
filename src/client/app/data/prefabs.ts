import * as THREE from "three";
import * as Tone from "tone";
import { getScale, getNote, AEOLIAN_SCALE, DORIAN_SCALE } from "./note-frequencies";
import { Game } from "../game";
import { AudioComponent } from "../core/components/audio-component";
import { AudioEffectComponent } from "../core/components/audio-effect-component";
import { AudioListenerComponent } from "../core/components/audio-listener-component";
import { AudioSourceComponent } from "../core/components/audio-source-component";
import { EComponents } from "../core/components/component";
import { FirstPersonControllerComponent } from "../core/components/first-person-controller-component";
import { GraphicsComponent } from "../core/components/graphics-component";
import { TransformationComponent } from "../core/components/transformation-component";
import { AnimationComponent, Entity, IScript, ScriptComponent } from "../core";
import { TraceScript } from "../scripts/trace.script";

const material = new THREE.MeshStandardMaterial({

    color: 0x000000,
    roughness: 0,
    metalness: 1
})


let t = new THREE.TextureLoader().load( 'assets//image2.png' )

t.wrapS = THREE.RepeatWrapping
t.wrapT = THREE.RepeatWrapping

let u = {

    'amplitude': { value: 1.0 },
    'color': { value: new THREE.Color( 0x00FFFF ) },
    'colorTexture': { value: t }
}

u[ 'colorTexture' ].value.wrapS = u[ 'colorTexture' ].value.wrapT = THREE.RepeatWrapping;


const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `

        uniform float amplitude;

        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {

            vNormal = normal;
            vUv = ( 0.5 + amplitude ) * uv + vec2( amplitude );

            vec3 newPosition = position + amplitude * normal * vec3( 0.01 );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }
    `,
    fragmentShader: `

        varying vec3 vNormal;
        varying vec2 vUv;

        uniform vec3 color;
        uniform sampler2D colorTexture;

        void main() {

            vec3 light = vec3( 0.5, 0.2, 1.0 );
            light = normalize( light );

            float dProd = dot( vNormal, light ) * 0.5 + 0.5;

            vec4 tcolor = texture2D( colorTexture, vUv );
            vec4 gray = vec4( vec3( tcolor.r * 0.3 + tcolor.g * 0.59 + tcolor.b * 0.11 ), 1.0 );

            gl_FragColor = gray * vec4( vec3( dProd ) * vec3( color ), 1.0 );

        }
    `,
    uniforms: {

		time: { value: 1.0 },
		resolution: { value: new THREE.Vector2() },
        amplitude: u.amplitude,
        color: u.color,
        colorTexture: u.colorTexture,
    }
})


export const Prefabs = {

    Player: () => {

        let c = Math.round(Math.random() * 16777215)

        let t = new TransformationComponent()
        let m = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 32), new THREE.MeshStandardMaterial({ color: c }))
        m.geometry.translate(0, m.geometry.parameters.radius / 2, 0)

        const e = Game.world.createEntity()
        e.name = 'Player'
        e.addComponent(t)
        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new AudioListenerComponent(t))

        return e
    },

    ControllablePlayer: () => {

        const e = Game.world.createEntity()
        e.name = 'ControllablePlayer'

        let t = new TransformationComponent()
        e.addComponent(t)

        let m = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 32), new THREE.MeshDistanceMaterial())
        m.geometry.translate(0, .5, 0)
        e.addComponent(new GraphicsComponent(m))

        e.addComponent(new AudioListenerComponent(t))
        e.addComponent(new ScriptComponent(TraceScript, e))
        e.addComponent(new FirstPersonControllerComponent(Game.camera))

        return e
    },



    /* Environment */

    Tree: () => {

        const e = Game.world.createEntity()
        e.name = 'Tree'

        let s = (Math.random() * 3) + .7

        let m = new THREE.Mesh(new THREE.BoxGeometry(s, Math.random() * 100, s), shaderMaterial)
        m.geometry.translate(0, (m.geometry.parameters.height / 2) - s, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateX((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * r) - r)

        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new TransformationComponent())
        e.addComponent(new AnimationComponent((e: Entity, transform: TransformationComponent) => {

            transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
            transform.scale.y = Math.cos(Tone.context.currentTime) + 2
            transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
            transform.needsUpdate = true
        }))

        const type = ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType

        let sourceOptions: OscillatorOptions = {
            frequency: getScale(getNote('F' + Math.round((Math.random() * 3) + 1)), AEOLIAN_SCALE)[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency,
            type: type //'sine'
        }

        const player = new Tone.Player("https://tonejs.github.io/audio/berklee/gong_1.mp3")
        player.autostart = true
        player.loop = true

        e.addComponent(new AudioComponent(new AudioSourceComponent(player, .5, -5), undefined, 40))

        return e
    },

    Stone: () => {

        const e = Game.world.createEntity()
        e.name = 'Stone'

        const max = 10
        let m = new THREE.Mesh(new THREE.BoxGeometry(Math.random() * max, Math.random() * max, Math.random() * max), shaderMaterial)
        // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateX((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * r) - r)

        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new TransformationComponent())
        e.addComponent(new AnimationComponent((e: Entity, transform: TransformationComponent) => {

            // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
            transform.scale.y = Math.cos(Tone.context.currentTime) + 2
            // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
            transform.needsUpdate = true
        }))

        let sourceOptions: OscillatorOptions = {
            frequency: getScale(getNote('F' + Math.round((Math.random() * 3) + 1)), AEOLIAN_SCALE)[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency,
            type: 'triangle'
        }

        e.addComponent(new AudioComponent(new AudioSourceComponent(new Tone.Oscillator(sourceOptions), .5, -8), undefined, 20))

        return e
    }
    ,

    DeadTree: () => {

        const e = Game.world.createEntity()
        e.name = 'DeadTree'

        let s = (Math.random() * 3) + .7

        let m = new THREE.Mesh(new THREE.BoxGeometry(s, Math.random() * 60, s), shaderMaterial)
        m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateY((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * Math.PI) - Math.PI)
        m.geometry.rotateX(Math.PI / 2)

        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new TransformationComponent())
        e.addComponent(new AnimationComponent((e: Entity, transform: TransformationComponent) => {

            // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
            transform.scale.y = Math.cos(Tone.context.currentTime) + 2
            // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
            transform.needsUpdate = true
        }))

        let sourceOptions: OscillatorOptions = {
            frequency: getScale(getNote('F' + Math.round((Math.random() * 3) + 1)), AEOLIAN_SCALE)[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency,
            type: 'sine'
        }

        e.addComponent(new AudioComponent(new AudioSourceComponent(new Tone.Oscillator(sourceOptions), .5, -5), undefined, 40))

        return e
    }
}