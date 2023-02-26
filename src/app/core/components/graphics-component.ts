import { Object3D } from "three";
import { Game } from "../../game";
import { Component, EComponents } from "./component";



export class GraphicsComponent implements Component {

    name: string

    object: Object3D

    constructor(object: Object3D) {

        this.name = EComponents.GRAPHICS

        this.object = object

        this.object.traverse(o => {

            o.matrixAutoUpdate = false
        })

        Game.world.scene.add(this.object)

        console.log('GRAPHICS')

        // let m = new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 32), new THREE.MeshDistanceMaterial())
        // // m.geometry.translate(0, .5, 0)
        // // m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        // m.castShadow = true
        // m.receiveShadow = true
        // this.add(m)
    }
}