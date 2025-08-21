import * as THREE from "three";
import * as Tone from "tone";
import { getScale, getNote, AEOLIAN_SCALE, DORIAN_SCALE, CUSTOM_SCALE } from "./note-frequencies";
import { Game } from "../../client/game";
import { AffectionScript } from "./scripts/affection.script";
import { Utils } from "../util/utils";
import { TraceScript } from "./scripts/trace.script";

import { drum_fills_samples, factory_samples } from './sample-db'
import { AudioListenerComponent } from "../../ecs/components/audio/audio-listener-component";
import { TransformationComponent } from "../../ecs/components/transformation-component";
import { AudibleRadiusComponent } from "../../ecs/components/audio/audible-radius-component";

import { Materials } from "./material-factory";
import { VelocityComponent } from "../../ecs/components/velocity-component";
import { OscillatorComponent } from "../../ecs/components/audio/oscillator-component";
import { ECS } from "../../ecs/ecs";
import { InputComponent } from "../../ecs/components/input-component";
import { MovementComponent } from "../../ecs/components/movement-component";
import { PrimitiveMeshComponent } from "../../ecs/components/primitive-mesh-component";
import { SpherePrimitive, SphereOptions, LathePrimitive, LatheOptions, CuboidPrimitive, CuboidOptions } from "../../ecs/primitive-factory";
import { RigidbodyComponent } from "../../ecs/components/rigidbody-component";



let texture = new THREE.TextureLoader().load( 'assets//image2.png' )

texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping


export const Prefabs = {

    Guest: (ecs: ECS) => {

        const e = ecs.createEntity()
        
        ecs.addName(e, 'guest')
        ecs.addTag(e, 'guest')

        ecs.addComponent(e, new RigidbodyComponent())

        const t = new TransformationComponent()
        ecs.addComponent(e, t)
        ecs.addComponent(e, new VelocityComponent())
        
        t.position.y = .3

        ecs.addComponent(e, new MovementComponent())
        ecs.addComponent(e, new PrimitiveMeshComponent<SpherePrimitive, SphereOptions>({ primitive: 'SPHERE', options: { name: 'Sphere', radius: .3 }, materialTag: Materials.PLAYER }))

        ecs.addComponent(e, new AudibleRadiusComponent({ radius: 100 }))

        
        // ecs.addComponent(e, new ScriptComponent(new TraceScript()))

        return e
    },

    Player: (ecs: ECS) => {

        const e = ecs.createEntity()
        
        ecs.addName(e, 'player')
        ecs.addTag(e, 'player')

        ecs.addComponent(e, new RigidbodyComponent())

        const t = new TransformationComponent()
        ecs.addComponent(e, t)
        ecs.addComponent(e, new VelocityComponent())
        
        t.position.y = .3

        ecs.addComponent(e, new InputComponent())
        ecs.addComponent(e, new MovementComponent())
        ecs.addComponent(e, new PrimitiveMeshComponent<SpherePrimitive, SphereOptions>({ primitive: 'SPHERE', options: { name: 'Sphere', radius: .3 }, materialTag: Materials.PLAYER }))

        ecs.addComponent(e, new AudioListenerComponent({ transformRefTag: 'player' }))
        ecs.addComponent(e, new AudibleRadiusComponent({ radius: 100 }))
        // ecs.addComponent(e, new ScriptComponent(new TraceScript()))

        return e
    },



    // /* Environment */

    // Tree: () => {

    //     const ecs = Game.i.ecs

    //     const e = ecs.createEntity()
    //     ecs.addComponent(e, new TagComponent('Tree'))

    //     let s = (Math.random() * 4) + .7

    //     let m = new THREE.Mesh(new THREE.BoxGeometry(s, Math.random() * 99, s), faceDisplacementShader(1, 0x000000).clone())
    //     m.geometry.translate(0, (m.geometry.parameters.height / 2) - s, 0)
    //     // let r = (Math.PI / 16)
    //     // m.geometry.rotateX((Math.random() * r) - r)
    //     // m.geometry.rotateZ((Math.random() * r) - r)
    //     m.castShadow = true

    //     ecs.addComponent(e, new GraphicsComponent(m))
    //     ecs.addComponent(e, new TransformationComponent())
    //     // ecs.addComponent(new BoundingboxComponent())
    //     ecs.addComponent(e, new AnimationComponent((e: Entity, transform: TransformationComponent) => {

    //         transform.scale.x = Math.sin(Tone.context.currentTime) + 1.8
    //         transform.scale.y = Math.cos(Tone.context.currentTime) + 2
    //         transform.scale.z = Math.sin(Tone.context.currentTime) + 1.8
    //         transform.needsUpdate = true
    //     }))

    //     const type = ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType
    //     const frequency = getScale(getNote('F' + Math.round((Math.random() * 3) + 1)), CUSTOM_SCALE)[Math.round(Math.random() * CUSTOM_SCALE.length)].frequency

    //     ecs.addComponent(e, new OscillatorComponent(type, frequency, 0))
    //     ecs.addComponent(e, new ScriptComponent(new AffectionScript()))
    //     ecs.addComponent(e, new AudibleRadiusComponent(100))

    //     return e
    // },

    // RealTree: () => {

    //     const ecs = Game.i.ecs

    //     const e = ecs.createEntity()
    //     ecs.addComponent(e, new TagComponent('Tree'))

    //     let m
    //     AssetManager.load('/assets/models/Tree'+ (Math.round(Math.random() * 2) + 1) +'.glb').then(glb => {

    //         console.log('TREE LOADED', glb)

    //         m = glb.scene

    //         let r = (Math.PI / 8)
    //         m.rotateX((Math.random() * r) - r)
    //         m.rotateZ((Math.random() * r) - r)

    //         const g = ecs.getComponent<GraphicsComponent>(e, GraphicsComponent)
    //         g.object.add(glb.scene)
    //     })

    //     ecs.addComponent(e, new GraphicsComponent(new THREE.Object3D()))
    //     ecs.addComponent(e, new TransformationComponent())
    //     // ecs.addComponent(e, new BoundingboxComponent())
    //     ecs.addComponent(e, new AnimationComponent((e: Entity, transform: TransformationComponent) => {

    //         // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
    //         // transform.scale.y = Math.cos(Tone.context.currentTime) + 2
    //         // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5

    //         transform.rotation.y = Math.sin(Tone.context.currentTime / 10)
    //         transform.needsUpdate = true
    //     }))

    //     const type = ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType

    //     let sourceOptions: OscillatorOptions = {
    //         frequency: getScale(getNote('F' + Math.round((Math.random() * 3) + 1)), AEOLIAN_SCALE)[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency,
    //         type: type //'sine'
    //     }

    //     // ecs.addComponent(e, new AudioComponent(new AudioSourceComponent(new Tone.Oscillator(sourceOptions), .5, -10), undefined, 100))
    //     // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))
    //     ecs.addComponent(e, new AudibleRadiusComponent(100))


    //     return e
    // },


    Stone: (ecs: ECS) => {

        const e = ecs.createEntity()

        ecs.addName(e, 'Stone')
        ecs.addTag(e, 'organism')

        // const max = 10
        // let m = new THREE.Mesh(new THREE.BoxGeometry(Math.random() * max, Math.random() * max, Math.random() * max), faceDisplacementShader(1, 0x000000).clone())
        // m.castShadow = true
        // m.receiveShadow = true
        // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        // let r = (Math.PI / 8)
        // m.geometry.rotateX((Math.random() * r) - r)
        // m.geometry.rotateZ((Math.random() * r) - r)

        ecs.addComponent(e, new TransformationComponent())
        // ecs.addComponent(e, new AssetMeshComponent(Globals.path + '/assets/models/gltf/Flower_3_Single.gltf'))
        ecs.addComponent(e, new PrimitiveMeshComponent<CuboidPrimitive, CuboidOptions>({ primitive: 'CUBOID', options: { name: 'Cuboid', w: 3, h: 100, d: 3 }, materialTag: Materials.FACE_DISPLACEMENT }))
        ecs.addComponent(e, new AudibleRadiusComponent({ radius: 100 }))
        // ecs.addComponent(e, new AnimationComponent((e: Entity, transform: TransformationComponent) => {

        //     // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
        //     transform.scale.y = Math.cos(Tone.context.currentTime) + 2
        //     // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
        //     transform.needsUpdate = true
        // }))


        // const sample = drum_fills_samples[Math.round(Math.random() * drum_fills_samples.length - 1)]
        // ecs.addComponent(e, new PlayerComponent(sample, true))


        const type = ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType

        const frequency = getScale(getNote('F' + Math.round((Math.random() * 3) + 1)), AEOLIAN_SCALE)[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency

        ecs.addComponent(e, new OscillatorComponent({ waveform: type, frequency, volume: -10 }))

        // ecs.addComponent(e, new ScriptComponent(new AffectionScript()))

        return e
    },


    // crystal: () => {

    //     const ecs = Game.i.ecs
    //     const e = ecs.createEntity()
    //     ecs.addComponent(e, new TagComponent('Crystal'))

    //     const max = 1
    //     // let m = new THREE.Mesh(new THREE.SphereGeometry(Math.random() * max, 64, 64), defShaderMaterial(1, 0x000000).clone())
    //     let m = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random() * max, 0), faceDisplacementShader(1, 0x000000).clone())
    //     m.castShadow = true
    //     m.receiveShadow = true
    //     // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
    //     let r = (Math.PI / 8)
    //     m.geometry.rotateX((Math.random() * r) - r)
    //     m.geometry.rotateZ((Math.random() * r) - r)

    //     ecs.addComponent(e, new GraphicsComponent(m))
    //     ecs.addComponent(e, new TransformationComponent())
    //     ecs.addComponent(e, new AnimationComponent((e: Entity, transform: TransformationComponent) => {

    //         // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
    //         transform.scale.y = Math.cos(Tone.context.currentTime) + 2
    //         // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
    //         transform.needsUpdate = true
    //     }))


    //     const sample = factory_samples[Math.round(Math.random() * factory_samples.length - 1)]

    //     ecs.addComponent(e, new PlayerComponent(sample, true))
    //     ecs.addComponent(e, new ScriptComponent(new AffectionScript()))
    //     ecs.addComponent(e, new AudibleRadiusComponent(100))

    //     return e
    // },


    // DeadTree: () => {

    //     const ecs = Game.i.ecs
    //     const e = ecs.createEntity()
    //     ecs.addComponent(e, new TagComponent('DeadTree'))

    //     let s = (Math.random() * 3) + .7

    //     let m = new THREE.Mesh(new THREE.BoxGeometry(s, Math.random() * 49, s), faceDisplacementShader(1, 0x000000).clone())
    //     m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
    //     let r = (Math.PI / 8)
    //     m.geometry.rotateY((Math.random() * r) - r)
    //     m.geometry.rotateZ((Math.random() * Math.PI) - Math.PI)
    //     m.geometry.rotateX(Math.PI / 2)

    //     ecs.addComponent(e, new GraphicsComponent(m))
    //     ecs.addComponent(e, new TransformationComponent())
    //     ecs.addComponent(e, new AnimationComponent((e: Entity, transform: TransformationComponent) => {

    //         // transform.scale.x = Math.sin(Tone.context.currentTime) + 1.5
    //         transform.scale.y = Math.cos(Tone.context.currentTime) + 2
    //         // transform.scale.z = Math.sin(Tone.context.currentTime) + 1.5
    //         transform.needsUpdate = true
    //     }))

    //     let sourceOptions: OscillatorOptions = {
    //         frequency: getScale(getNote('F' + Math.round((Math.random() * 3) + 1)), AEOLIAN_SCALE)[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency,
    //         type: 'sine'
    //     }

    //     ecs.addComponent(e, new ScriptComponent(new AffectionScript()))

    //     return e
    // }
}