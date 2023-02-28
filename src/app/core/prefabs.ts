import * as THREE from "three";
import { getScale, getNote, AEOLIAN_SCALE, DORIAN_SCALE } from "../data/note-frequencies";
import { Game } from "../game";
import { AudioComponent } from "./components/audio-component";
import { AudioListenerComponent } from "./components/audio-listener-component";
import { EComponents } from "./components/component";
import { FirstPersonControllerComponent } from "./components/first-person-controller-component";
import { GraphicsComponent } from "./components/graphics-component";
import { TransformationComponent } from "./components/transformation-component";

export class Prefabs {

    static Player() {

        let t = new TransformationComponent()
        let m = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 32), new THREE.MeshToonMaterial({color: 0x000000 }))
        m.geometry.translate(0, m.geometry.parameters.radius / 2, 0)

        const e = Game.world.createEntity()
        e.name = 'player'
        e.addComponent(t)
        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new AudioListenerComponent(t))

        return e
    }

    static ControllablePlayer() {

        let t = new TransformationComponent()
        let m = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 32), new THREE.MeshToonMaterial({color: 0x000000 }))
        m.geometry.translate(0, m.geometry.parameters.radius / 2, 0)

        const e = Game.world.createEntity()
        e.name = 'player'
        e.addComponent(t)
        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new AudioListenerComponent(t))
        e.addComponent(new FirstPersonControllerComponent(Game.camera, (e.getComponent(EComponents.GRAPHICS) as GraphicsComponent).object))

        return e
    }

    static Tree() {

        let s = (Math.random() * 3) + .7

        let m = new THREE.Mesh(new THREE.BoxGeometry(s, Math.random() * 100, s), new THREE.MeshDistanceMaterial())
        m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateX((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * r) - r)

        const e = Game.world.createEntity()
        e.name = 'tree'
        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new TransformationComponent())
        e.addComponent(new AudioComponent(
            getScale(
                getNote('F' + Math.round((Math.random() * 3) + 1)),
                AEOLIAN_SCALE
            )[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency,

            // ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType,
            'sine',
            
            .4,
            40
        ))
        return e
    }

    static Stone() {

        const max = 10
        let m = new THREE.Mesh(new THREE.BoxGeometry(Math.random() * max, Math.random() * max, Math.random() * max), new THREE.MeshDistanceMaterial())
        // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateX((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * r) - r)

        const e = Game.world.createEntity()
        e.name = 'tree'
        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new TransformationComponent())
        e.addComponent(new AudioComponent(
            getScale(
                getNote('F' + Math.round((Math.random() * 1))),
                AEOLIAN_SCALE
            )[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency,

            ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType,
            .2,
            20
        ))

        return e
    }

};