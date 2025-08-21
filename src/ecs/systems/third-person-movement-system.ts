import { PerspectiveCamera, Quaternion, Vector3 } from "three";
import { InputComponent } from "../components/input-component";
import { MovementComponent } from "../components/movement-component";
import { TransformationComponent } from "../components/transformation-component";
import { VelocityComponent } from "../components/velocity-component";
import { ECS } from "../ecs";
import { System } from "./system";
import { Matrix4 } from "three/src/math/Matrix4";
import { M } from "../../shared/util/math";

export class ThirdPersonMovementSystem extends System {

  private camera: PerspectiveCamera
  private moveDir = new Vector3()
  private forward = new Vector3()
  private right = new Vector3()
  private quaternionOffset = new Quaternion()

  constructor(camera: PerspectiveCamera) {
    super();
    this.camera = camera;
  }

  update(ecs: ECS, dt: number): void {

    for (const [entity, [input, velocity, transform, movement]] of ecs.queryTagged("player", InputComponent, VelocityComponent, TransformationComponent, MovementComponent)) {


      if (input.direction.lengthSq() === 0) {

        velocity.velocity.set(0, velocity.velocity.y, 0) // Retain Y (jumping/gravity) if needed
        continue
      }

      const a = Math.atan2((input.direction.x - M.FORWARD.x), input.direction.z - M.FORWARD.z)
      this.quaternionOffset.setFromAxisAngle(M.UP, a)
      
      // Step 1: Get camera-relative directions
      this.camera.getWorldDirection(this.forward)
      this.forward.y = 0
      this.forward.normalize()

      this.right.crossVectors(this.forward, new Vector3(0, 1, 0)).normalize()

      // Step 2: Translate input into world movement direction
      this.moveDir
        .copy(this.forward)
        .multiplyScalar(input.direction.z)
        .addScaledVector(this.right, input.direction.x)
        .normalize()

      // Step 3: Apply to velocity
      velocity.velocity.x = this.moveDir.x * (input.isRunning ? movement.runSpeed : movement.speed)
      velocity.velocity.z = this.moveDir.z * (input.isRunning ? movement.runSpeed : movement.speed)

      // Step 4: Smooth rotation
      const lookAt = new Vector3().copy(transform.position).add(this.moveDir)
      const targetMatrix = new Matrix4().lookAt(transform.position, lookAt, new Vector3(0, 1, 0))
      const targetQuat = new Quaternion().setFromRotationMatrix(targetMatrix)
      targetQuat.multiply(this.quaternionOffset)

      transform.quaternion.slerp(targetQuat, 0.5) // Smoothly rotate
      transform.useQuaternion = true
    }
  }
}
