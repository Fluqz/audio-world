import { RenderManager } from "../../client/render-manager";
import { GraphicsComponent } from "../components/graphics-component"
import { TransformationComponent } from "../components/transformation-component";
import { ECS } from "../ecs";
import { System } from "./system";

export class RenderSystem extends System {

    public ecs: ECS;
    public renderManager: RenderManager

    constructor(ecs: ECS, renderManager: RenderManager) {
        super()
        
        this.ecs = ecs;
        this.renderManager = renderManager;
    }
  

    update(ecs: ECS, dt:number): void {

        for (const [e, [transform, graphics]] of ecs.queryEntities(TransformationComponent, GraphicsComponent)) {

            if(!transform.needsUpdate) continue

            transform.needsUpdate = false

            
            graphics.object.position.copy(transform.position)
            graphics.object.scale.copy(transform.scale)

            // How to update either euler or quaternion?
            graphics.object.rotation.copy(transform.rotation)
            // graphics.object.quaternion.copy(transform.quaternion)

            graphics.object.updateMatrix()
        }
    }
}