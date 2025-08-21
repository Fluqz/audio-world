import { Vector3, Camera, MathUtils } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformationComponent } from "../components/transformation-component";
import { ECS } from "../ecs";
import { System } from "./system";
import { VelocityComponent } from "../components/velocity-component";
import { InputComponent } from "../components/input-component";
import { MovementComponent } from "../components/movement-component";

export class CameraFollowSystem extends System {
  
  private maxDistance = 6
  private minDistance = 3

  private oldPosition = new Vector3()

  constructor(private controls: OrbitControls, private lerpSpeed = 0.1) {
    super()

    controls.enableDamping = true
    controls.dampingFactor = 0.1

    controls.maxZoom = 10
    controls.minZoom = .2
  }

  update(ecs: ECS, dt: number): void {

    const result = ecs.getTaggedEntity("player", TransformationComponent, VelocityComponent, InputComponent, MovementComponent)
    if (!result) return

    const [_, [ transform, velocity, input, move ]] = result

    const offset = new Vector3().copy(this.controls.object.position).sub(transform.position)
    const moveOffset = new Vector3().copy(transform.position).sub(this.oldPosition)
    offset.add(moveOffset)

    const camDir = new Vector3()
    this.controls.object.getWorldDirection(camDir)

    // Smoothly follow player
    this.controls.target.lerp(transform.position, this.lerpSpeed)

    // Clamp camera distance
    const camPos = this.controls.object.position
    const target = transform.position

    this.controls.object.position.copy(transform.position).add(offset)

    this.controls.update()

    this.oldPosition.copy(transform.position)
  }
}
