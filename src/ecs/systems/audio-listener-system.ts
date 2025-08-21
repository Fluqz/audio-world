
// systems/listener-system.ts
import * as Tone from "tone";
import { ECS } from "../ecs";
import { System } from "./system";
import { TransformationComponent } from "../components/transformation-component";
import { Vector3 } from "three";

export class AudioListenerSystem extends System {

  private forward = new Vector3(0, 0, 1)

  update(ecs: ECS, dt: number) {

    const player = ecs.getTaggedEntity('player', TransformationComponent);

    if (!player) return;

    const [e, [transform]] = player

    // Update listener position
    Tone.Listener.positionX.value = transform.position.x
    Tone.Listener.positionY.value = transform.position.y
    Tone.Listener.positionZ.value = transform.position.z

    this.forward.set(1, 0, 0).applyQuaternion(transform.quaternion)

    // Update listener orientation
    Tone.Listener.forwardX.value = this.forward.x
    Tone.Listener.forwardY.value = this.forward.y
    Tone.Listener.forwardZ.value = this.forward.z

    Tone.Listener.upX.value = 0
    Tone.Listener.upY.value = 1
    Tone.Listener.upZ.value = 0
  }
}