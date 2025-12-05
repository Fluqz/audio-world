import { ECS } from "../ecs"
import { System } from "./system"

import { InputComponent } from '../components/input-component';
import { Component, ComponentClass } from "../components/component";
import { Entity } from "../entity";
import { Globals } from "../../globals";

export type GamepadButton = number;
export type KeyboardKey = string;

export type ModifierKey = 'shift' | 'alt' | 'ctrl' | 'meta';

export type InputSource =
  | { type: 'keyboard'; key: KeyboardKey; modifiers?: ModifierKey[] }
  | { type: 'gamepad_button'; button: GamepadButton }
  | { type: 'gamepad_axis'; axis: number; direction: 1 | -1; threshold?: number };

export type ActionMap = Record<string, InputSource[]>

export const defaultActionMap: ActionMap = {
  move_forward: [
    { type: "keyboard", key: "w" },
    { type: "gamepad_axis", axis: 1, direction: -1 },
  ],
  move_backward: [
    { type: "keyboard", key: "s" },
    { type: "gamepad_axis", axis: 1, direction: 1 },
  ],
  move_left: [
    { type: "keyboard", key: "a" },
    { type: "gamepad_axis", axis: 0, direction: -1 },
  ],
  move_right: [
    { type: "keyboard", key: "d" },
    { type: "gamepad_axis", axis: 0, direction: 1 },
  ],
  jump: [{ type: "keyboard", key: " " }, { type: "gamepad_button", button: 0 }],
  run: [{ type: "keyboard", key: "shift" }], 
};



export class InputSystem extends System {

  entities: Map<number, [InputComponent]> = new Map()
  components: ComponentClass<any>[] = [InputComponent]

  private keys: Record<string, boolean> = {};
  private gamepadIndex = 0;
  private actionMap: ActionMap;

  constructor(actionMap: ActionMap, ) {
    super()

    this.actionMap = actionMap;

    window.addEventListener('keydown', (e: KeyboardEvent) => {console.log('keydown', e.key);this.keys[e.key.toLowerCase()] = true })
    window.addEventListener('keyup', (e: KeyboardEvent) => {

      console.log('keydown', e.key); 
      
      delete this.keys[e.key.toLowerCase()] 
    })

    // Store keys globally for network input
    Globals.keyMap = this.keys
  }

  init(ecs: ECS): void {

    const queried = ecs.queryEntities(InputComponent)

    for(let [e, [c]] of queried) {

        this.tryTrackEntity(ecs, e)
    }
  }

  update(ecs: ECS, dt: number) {

    const gamepad = navigator.getGamepads?.()[this.gamepadIndex]

    for (const [entity, [input]] of this.entities.entries()) {


      input.keys = this.keys

        let moveX
        let moveZ
        let jump

        moveX = this.resolveAxis('move_right', gamepad) - this.resolveAxis('move_left', gamepad)
        moveZ = this.resolveAxis('move_forward', gamepad) - this.resolveAxis('move_backward', gamepad)

        // jump = this.resolveButton('jump', gamepad)
        
        input.isRunning = this.resolveButton('run', gamepad)

        input.direction.set(moveX, 0, moveZ)
        
        // console.log('update input', entity, input.velocity)
    }
  }

  private checkModifiers(src: InputSource): boolean {

    if (src.type !== 'keyboard' || !src.modifiers) return true;

    for (const mod of src.modifiers) {

      if (!this.keys[mod]) return false; // require modifier to be pressed
    }
    return true;
  }

  private resolveAxis(action: string, gamepad?: Gamepad): number {

    const sources = this.actionMap[action];

    if (!sources) return 0;

    for (const src of sources) {

      if (src.type === 'keyboard' && this.keys[src.key.toLowerCase()]) {

        if (this.checkModifiers(src)) return 1;
      }

      if (src.type === 'gamepad_axis' && gamepad) {

        const value = gamepad.axes[src.axis] ?? 0;
        const dir = src.direction;
        const threshold = src.threshold ?? 0.2;

        if (Math.abs(value) > threshold && Math.sign(value) === dir) {

          return Math.abs(value);
        }
      }
    }

    return 0;
  }

  private resolveButton(action: string, gamepad?: Gamepad): boolean {

    const sources = this.actionMap[action];

    if (!sources) return false;

    for (const src of sources) {

      if (src.type === 'keyboard' && this.keys[src.key.toLowerCase()]) {

        if (this.checkModifiers(src)) return true;
      }

      if (src.type === 'gamepad_button' && gamepad) {
        
        if (gamepad.buttons[src.button]?.pressed ?? false) return true;
      }
    }

    return false;
  }

}
