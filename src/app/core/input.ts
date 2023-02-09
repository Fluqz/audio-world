
/** Includes all possible actions for inputs. 
 * Values equal the keys of IMapping.
 */
export enum EInput {

    FORWARD = 'forward',
    BACK = 'back',
    LEFT = 'left',
    RIGHT = 'right',
    JUMP = 'jump',
    INTERACT = 'interact',
}

/** Includes all usable keys.
 * Values are the actual keycodes.
 */
export enum EKey {

    ArrowUp = 38,
    ArrowDown = 40,
    ArrowLeft = 37,
    ArrowRight = 39,
    W = 87,
    A = 65,
    S = 83,
    D = 68,
    Space = 32,
    Shift = 16,
    Ctrl = 17,
    Alt = 18,
    Enter = 13
}

/** Interface for all possible input actions */
export interface IMapping {

    forward: number
    back: number
    left: number
    right: number
    jump: number
    interact: number
}

/** Keeps track of mouse and keyboard input and serves
 * as a bridge to easiely query user actions.
 */
export class Input {

    /** Flag wheather mouse is pressed or not */
    static isMouseDown: boolean = false
    /** List of currently active keys (including mouse keys). */
    static keys: EKey[]
    /** List of binded actions with their keys. */
    static mapping: IMapping = {

        forward: EKey.W,
        back: EKey.S,
        left: EKey.A,
        right: EKey.D,
        jump: EKey.Space,
        interact: EKey.Enter
    }

    private dom: HTMLElement



    constructor(dom: HTMLElement) {

        this.dom = dom

        Input.keys = []

        this.dom.addEventListener('pointerdown', this.onPointerDown.bind(this), false)
        this.dom.addEventListener('pointerup', this.onPointerUp.bind(this), false)
        document.addEventListener('keydown', this.onKeyDown.bind(this), false)
        document.addEventListener('keyup', this.onKeyUp.bind(this), false)
    }

    static on(input:EInput) {

        if(Input.mapping.hasOwnProperty(input)) {

            return Input.keys.includes(Input.mapping[input])
        }
    }

    static setMapping() {}

    private addInput(input: number) {

        if(!Input.keys.includes(input)) Input.keys.push(input)
    }
    private removeInput(input: number) {

        if(Input.keys.includes(input)) Input.keys.splice(Input.keys.indexOf(input), 1)
    }

    onPointerDown(e) {

        // console.log('pointerdown', e)

        this.addInput(e.button)
    }

    onPointerUp(e) {

        // console.log('pointerup', e)

        this.removeInput(e.button)
    }

    onKeyDown(e) {

        // console.log('keydown', e.key, e.code, e.keyCode, e)

        this.addInput(e.keyCode)
    }

    onKeyUp(e) {

        // console.log('keyup', e.key, e.code, e.keyCode, e)

        this.removeInput(e.keyCode)
    }
}
