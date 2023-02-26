import * as THREE from "three";
import { getScale, getNote, AEOLIAN_SCALE, DORIAN_SCALE } from "../../data/note-frequencies";
import { Game } from "../../game";
import { AudioComponent } from "../components/audio-component";
import { AudioListenerComponent } from "../components/audio-listener-component";
import { EComponents } from "../components/component";
import { FirstPersonControllerComponent } from "../components/first-person-controller-component";
import { GraphicsComponent } from "../components/graphics-component";
import { TransformationComponent } from "../components/transformation-component";

export class Prefabs {

    static Player() {

        let t = new TransformationComponent()
        let m = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 32), new THREE.MeshDistanceMaterial())
        m.geometry.translate(0, .25, 0)

        const e = Game.world.createEntity()
        e.name = 'player'
        e.addComponent(t)
        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new AudioListenerComponent(t))
        e.addComponent(new FirstPersonControllerComponent(Game.camera, (e.getComponent(EComponents.GRAPHICS) as GraphicsComponent).object))

        return e
    }

    static Tree() {

        let m = new THREE.Mesh(new THREE.BoxGeometry(.5, 30, .5), new THREE.MeshDistanceMaterial())
        m.geometry.translate(0, 15, 0)

        const e = Game.world.createEntity()
        e.name = 'tree'
        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new TransformationComponent())
        e.addComponent(new AudioComponent(
            getScale(
                getNote('F' + Math.round((Math.random() * 3) + 1)),
                AEOLIAN_SCALE
            )[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency,

            ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType,
            
            .7,
            30
        ))
        return e
    }

    static Stone() {

        let m = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), new THREE.MeshDistanceMaterial())
        m.geometry.translate(0, .25, 0)

        const e = Game.world.createEntity()
        e.name = 'tree'
        e.addComponent(new GraphicsComponent(m))
        e.addComponent(new TransformationComponent())
        e.addComponent(new AudioComponent(
            getScale(
                getNote('F' + Math.round((Math.random() * 3) + 1)),
                AEOLIAN_SCALE
            )[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency,

            ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType,
            .2,
            30
        ))


        return e
    }

};