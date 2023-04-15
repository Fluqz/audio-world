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

export const Prefabs = {

    Player: () => {

        let c = Math.round(Math.random() * 16777215)

        let t = new TransformationComponent()
        let m = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 32), new THREE.MeshStandardMaterial({ color: c }))
        m.geometry.translate(0, m.geometry.parameters.radius / 2, 0)

        const e = Game.world.createEntity()
        e.name = 'player'
        e.addComponent(t)
        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new AudioListenerComponent(t))

        return e
    },

    ControllablePlayer: () => {

        let t = new TransformationComponent()

        let m = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 32), material)
        m.geometry.translate(0, .5, 0)

        const e = Game.world.createEntity()
        e.name = 'player'
        e.addComponent(t)
        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new AudioListenerComponent(t))

        e.addComponent(new ScriptComponent(TraceScript, e))

        let g = e.getComponent(EComponents.GRAPHICS) as GraphicsComponent
        e.addComponent(new FirstPersonControllerComponent(Game.camera, g.object))

        return e
    },

    Tree: () => {

        let s = (Math.random() * 3) + .7

        let m = new THREE.Mesh(new THREE.BoxGeometry(s, Math.random() * 100, s), material)
        m.geometry.translate(0, (m.geometry.parameters.height / 2) - s, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateX((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * r) - r)

        const e = Game.world.createEntity()
        e.name = 'tree'
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

        e.addComponent(new AudioComponent(new AudioSourceComponent(new Tone.Oscillator(sourceOptions), .5, -5), undefined, 40))

        return e
    },

    Stone: () => {

        const max = 10
        let m = new THREE.Mesh(new THREE.BoxGeometry(Math.random() * max, Math.random() * max, Math.random() * max), material)
        // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateX((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * r) - r)

        const e = Game.world.createEntity()
        e.name = 'tree'
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

        let s = (Math.random() * 3) + .7

        let m = new THREE.Mesh(new THREE.BoxGeometry(s, Math.random() * 60, s), material)
        m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateY((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * Math.PI) - Math.PI)
        m.geometry.rotateX(Math.PI / 2)

        const e = Game.world.createEntity()
        e.name = 'tree'
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