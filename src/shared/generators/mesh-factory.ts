import { Mesh, BoxGeometry } from "three"
import { MaterialFactory } from "../data/material-factory"

export type MeshType = 'stone' | 'tree'

export class MeshFactory {

    static create() {}


    private static createStone() {

        const max = 10
        let m = new Mesh(new BoxGeometry(Math.random() * max, Math.random() * max, Math.random() * max), MaterialFactory.faceDisplacementShader(1, 0x000000).clone())
        m.castShadow = true
        m.receiveShadow = true
        m.geometry.translate(0, m.geometry.parameters.height / 2, 0)
        let r = (Math.PI / 8)
        m.geometry.rotateX((Math.random() * r) - r)
        m.geometry.rotateZ((Math.random() * r) - r)

        return m
    }

}