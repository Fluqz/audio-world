
// systems/listener-system.ts
import * as Tone from "tone";
import { ECS } from "../ecs";
import { System } from "./system";
import { TransformationComponent } from "../components/transformation-component";
import { Vector3 } from "three";
import { M } from "../../shared/util/math";
import { Entity } from "../entity";
import { Component, ComponentClass, ComponentStore } from "../components/component";

export class AudioListenerSystem extends System {

  private forward = new Vector3(0, 0, 1)

  private playerTransform: TransformationComponent

  entities: Map<number, [TransformationComponent]> = new Map()
  components: ComponentClass<any>[] = [TransformationComponent]

  constructor() {
    super()

    Tone.Listener.upX.value = 0
    Tone.Listener.upY.value = 1
    Tone.Listener.upZ.value = 0
  }
  

  init(ecs: ECS) {

    const player = ecs.getTaggedEntity('player', TransformationComponent);

    if (!player) return;

    const [e, [transform]] = player

    this.playerTransform = transform
  }

  update(ecs: ECS, dt: number) {

    if(!this.playerTransform) return

    // Update listener position
    Tone.Listener.positionX.value = this.playerTransform.position.x
    Tone.Listener.positionY.value = this.playerTransform.position.y
    Tone.Listener.positionZ.value = this.playerTransform.position.z

    this.forward.copy(M.FORWARD).applyQuaternion(this.playerTransform.quaternion)

    // Update listener orientation
    Tone.Listener.forwardX.value = this.forward.x
    Tone.Listener.forwardY.value = this.forward.y
    Tone.Listener.forwardZ.value = this.forward.z
  }
}