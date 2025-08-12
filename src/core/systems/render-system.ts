import { RenderManager } from "../../client/render-manager";
import { GraphicsComponent } from "../components/graphics-component"
import { TransformationComponent } from "../components/transformation-component";
import { ECS } from "../ecs";
import { System } from "./system";

export class RenderSystem extends System {

    public ecs: ECS;
    public renderManager: RenderManager
    private graphics: GraphicsComponent
    private transform: TransformationComponent

    constructor(ecs: ECS, renderManager: RenderManager) {
        super()
        
        this.ecs = ecs;
        this.renderManager = renderManager;
    }
  

    update(ecs: ECS, dt:number): void {

        for (const [e, [transform, graphics]] of ecs.queryEntities(TransformationComponent, GraphicsComponent)) {

            this.transform = transform
            if(!this.transform.needsUpdate) continue

            this.transform.needsUpdate = false

            
            this.graphics = graphics

            this.graphics.object.position.copy(this.transform.position)
            this.graphics.object.scale.copy(this.transform.scale)

            // How to update either euler or quaternion?
            this.graphics.object.rotation.copy(this.transform.rotation)
            // this.graphics.object.quaternion.copy(this.transform.quaternion)

            this.graphics.object.updateMatrix()
        }
    }
}