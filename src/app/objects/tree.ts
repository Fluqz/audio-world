import { BufferGeometry, InstancedMesh, Material, Mesh, Object3D, Quaternion, Vector3 } from "three";
import { Oscillator, AmplitudeEnvelope, Gain } from "tone";
import { AEOLIAN_SCALE, getNote, getScale, HEPTATONIC_SCALE, HIRAJOSHI_SCALE } from "../data/note-frequencies";
import { PositionalAudio } from "../positional-audio";

 // Extends Mesh?
export class Tree extends PositionalAudio{

    mesh: Mesh

    geometry: BufferGeometry
    material: Material

    // add stuff like
    // Age (affect volume), height (affect range), strain (affect wave type)
    //

    constructor(geometry, material) {

        super(
            getScale(
                getNote('F' + Math.round((Math.random() * 3) + 1)),
                AEOLIAN_SCALE
            )[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency
        , 30)
        // super(notes[Math.round(Math.random() * (notes.length - 1))].frequency, 40)
        // super((Math.random() * 300) + 100, 40)

        this.geometry = geometry
        this.material = material
    }

    create() {

        this.mesh = new Mesh(this.geometry, this.material)
        this.mesh.matrixAutoUpdate = false
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true

        this.mesh.scale.set(1, 1 + (Math.random() * 1), 1)
    }


    update(position: Vector3, delta: number): void {
        
        this.mesh.position.copy(this.position)
        this.mesh.updateMatrix()

        super.update(position, delta)
    }
}