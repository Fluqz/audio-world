import { Box3, Mesh, Vector3 } from "three";
import { ComponentData } from "./component";
import { Game } from "../../client/game";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Primitive, PrimitiveFactory, PrimitiveOptions } from "../primitive-factory";
import { MaterialFactory, Materials } from "../../shared/data/material-factory";
import { MeshComponent } from "./mesh-component";


export class PrimitiveMeshComponent<TPrimitive extends Primitive, TOptions extends PrimitiveOptions> extends MeshComponent {
    primitive: TPrimitive

    options: TOptions
    
    // Runtime
    object: Mesh

    gltf: GLTF

    constructor(primitive: TPrimitive, options: TOptions, materialTag: Materials) {
        super()

        this.primitive = primitive

        this.object = this.loadPrimitive(primitive, options, materialTag)

        Game.i.renderManager.scene.add(this.object) // WHERE TO PUT THIS? ECS? SYSTEM?
    }

    loadPrimitive(primitive: TPrimitive, options: TOptions, materialTag: Materials) {

        const mesh = PrimitiveFactory.create(primitive, options)

        mesh.material = MaterialFactory.create(materialTag)

        return mesh
    }

    serialize(): ComponentData {

        return {
            
            primitive: this.primitive
        }
    }
}