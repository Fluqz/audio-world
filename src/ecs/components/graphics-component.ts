import { MeshBVH } from "three-mesh-bvh"
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass"
import { Game } from "../../client/game"
import { Component } from "./component"
import { rtMaterial as RT_MATERIAL } from "../../shared/data/material";
import { Box3, Object3D, Vector3 } from "three";


export class GraphicsComponent implements Component {

    object: Object3D

    constructor(object: Object3D) {

        this.object = object

        // object.name = 'Graphics'

        this.object.traverse(o => {

            o.matrixAutoUpdate = false
            o.matrixWorldAutoUpdate = false

            o.updateMatrix()
            o.updateWorldMatrix(true, true)
            o.updateMatrixWorld(true)
        })

        this.object.traverse(o => {

            if(o['isMesh']) {
                console.log('Adding mesh bvh!')

                const m = o as Mesh

                m.geometry.computeVertexNormals();
                const rtMaterial = RT_MATERIAL()

                m.material = rtMaterial

                // After creating the ShaderMaterial:
                rtMaterial.depthTest = false;
                rtMaterial.depthWrite = false;
                rtMaterial.transparent = false;
                // WebGL1 safety: enable frag-depth extension
                // rtMaterial.extensions = { fragDepth: true };

                const rtQuad = new FullScreenQuad( rtMaterial )

                const bvh = new MeshBVH(m.geometry);
                m.geometry.boundsTree = bvh
                m.userData.rtQuad = rtQuad


                console.log('bvh', m.geometry.boundsTree)
            }
        })

        Game.i.manager.scene.add(this.object)
    }


    getSize() {

        const bbox = new Box3()
        bbox.setFromObject(this.object)

        const size = new Vector3()
        bbox.getSize(size)

        return size
    }

    getCenter() {

        const bbox = new Box3()
        bbox.setFromObject(this.object)

        const center = new Vector3()
        bbox.getCenter(center)

        return center
    }
}