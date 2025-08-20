import { AssetMeshComponent } from "../components/asset-mesh-component";
import { MeshComponent } from "../components/mesh-component";
import { PrimitiveMeshComponent } from "../components/primitive-mesh-component";
import { TransformationComponent } from "../components/transformation-component";
import { ECS } from "../ecs";
import { System } from "./system";

export class RenderSyncSystem extends System {

    public ecs: ECS;

    constructor(ecs: ECS) {
        super()
        
        this.ecs = ecs;
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

        console.log('res', transform, mesh)
        mesh.object.position.copy(transform.position)
        mesh.object.scale.copy(transform.scale)

        // How to update either euler or quaternion?
        if(!transform.useQuaternion) mesh.object.rotation.copy(transform.rotation)
        else mesh.object.quaternion.copy(transform.quaternion)

        mesh.object.updateMatrix()
    }
}