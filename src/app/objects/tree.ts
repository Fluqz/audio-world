import { BufferGeometry, InstancedMesh, Material, Mesh, Object3D, Quaternion, Vector3 } from "three";
import { Oscillator, AmplitudeEnvelope, Gain } from "tone";
import { AnimationComponent } from "../core/components/animation-component";
import { AudioComponent } from "../core/components/audio-component";
import { AudioListenerComponent } from "../core/components/audio-listener-component";
import { GraphicsComponent } from "../core/components/graphics-component";
import { Entity } from "../core/entity";
import { AEOLIAN_SCALE, getNote, getScale, HEPTATONIC_SCALE, HIRAJOSHI_SCALE } from "../data/note-frequencies";

 // Extends Mesh?
export class Tree extends Entity {

    graphics: GraphicsComponent
    animation: AnimationComponent
    audio: AudioComponent
    

    mesh: Mesh

    geometry: BufferGeometry
    material: Material

    // add stuff like
    // Age (affect volume), height (affect range), strain (affect wave type)
    //

    constructor(geometry, material) {

        super()

        // super(
        //     getScale(
        //         getNote('F' + Math.round((Math.random() * 3) + 1)),
        //         AEOLIAN_SCALE
        //     )[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency
        // , 30)
        // super(notes[Math.round(Math.random() * (notes.length - 1))].frequency, 40)
        // super((Math.random() * 300) + 100, 40)

        this.geometry = geometry
        this.material = material
    }


    construct(): void {

        this.mesh = new Mesh(this.geometry, this.material)
        this.mesh.matrixAutoUpdate = false
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true

        this.mesh.scale.set(1, 1 + (Math.random() * 1), 1)

        this.add(this.mesh)
    }

    update(delta: number): void {
        throw new Error("Method not implemented.")
    }

    destruct(): void {
        throw new Error("Method not implemented.")
    }
}