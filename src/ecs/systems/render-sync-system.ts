import { AssetMeshComponent } from "../components/asset-mesh-component";
import { Component, ComponentClass } from "../components/component";
import { MeshComponent } from "../components/mesh-component";
import { PrimitiveMeshComponent } from "../components/primitive-mesh-component";
import { TransformationComponent } from "../components/transformation-component";
import { ECS } from "../ecs";
import { System } from "./system";

export class RenderSyncSystem extends System {

    entities: Map<number, [TransformationComponent, MeshComponent]> = new Map()

    components: ComponentClass<any>[] = [TransformationComponent]


    constructor() {
        super()
    }

    init(ecs: ECS): void {

        const assetMeshes = ecs.queryEntities(TransformationComponent, AssetMeshComponent)
        
        for(let [e] of assetMeshes)
            this.tryTrackEntity(ecs, e)
        
        const primitiveMeshes = ecs.queryEntities(TransformationComponent, PrimitiveMeshComponent)

        for(let [e] of primitiveMeshes)
            this.tryTrackEntity(ecs, e)
    }

    update(ecs: ECS, dt:number): void {

        for (const [e, [transform, mesh]] of ecs.queryEntitiesExtended(TransformationComponent, AssetMeshComponent)) {

            this.setTransform(mesh, transform)
        }

        for (const [e, [transform, mesh]] of ecs.queryEntitiesExtended(TransformationComponent, PrimitiveMeshComponent)) {

            this.setTransform(mesh, transform)
        }
    }

    setTransform(mesh: MeshComponent, transform: TransformationComponent) {

        mesh.object.position.copy(transform.position)
        mesh.object.scale.copy(transform.scale)

        // How to update either euler or quaternion?
        if(!transform.useQuaternion) mesh.object.rotation.copy(transform.rotation)
        else mesh.object.quaternion.copy(transform.quaternion)

        mesh.object.updateMatrix()
    }
}