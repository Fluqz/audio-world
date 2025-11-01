"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = exports.EKey = exports.EInput = void 0;
/** Includes all possible actions for inputs.
 * Values equal the keys of IMapping.
 */
var EInput;
(function (EInput) {
    EInput["FORWARD"] = "forward";
    EInput["BACK"] = "back";
    EInput["LEFT"] = "left";
    EInput["RIGHT"] = "right";
    EInput["JUMP"] = "jump";
    EInput["INTERACT"] = "interact";
    EInput["RUN"] = "run";
})(EInput = exports.EInput || (exports.EInput = {}));
/** Includes all usable keys.
 * Values are the actual keycodes.
 */
var EKey;
(function (EKey) {
    EKey[EKey["ArrowUp"] = 38] = "ArrowUp";
    EKey[EKey["ArrowDown"] = 40] = "ArrowDown";
    EKey[EKey["ArrowLeft"] = 37] = "ArrowLeft";
    EKey[EKey["ArrowRight"] = 39] = "ArrowRight";
    EKey[EKey["W"] = 87] = "W";
    EKey[EKey["A"] = 65] = "A";
    EKey[EKey["S"] = 83] = "S";
    EKey[EKey["D"] = 68] = "D";
    EKey[EKey["Space"] = 32] = "Space";
    EKey[EKey["Shift"] = 16] = "Shift";
    EKey[EKey["Ctrl"] = 17] = "Ctrl";
    EKey[EKey["Alt"] = 18] = "Alt";
    EKey[EKey["Enter"] = 13] = "Enter";
})(EKey = exports.EKey || (exports.EKey = {}));
/** Keeps track of mouse and keyboard input and serves
 * as a bridge to easiely query user actions.
 */
class Input {
    constructor(dom) {
        this.dom = dom;
        Input.keys = [];
        this.dom.addEventListener('pointerdown', this.onPointerDown.bind(this), false);
        this.dom.addEventListener('pointerup', this.onPointerUp.bind(this), false);
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }
    static on(input) {
        if (Input.mapping.hasOwnProperty(input)) {
            return Input.keys.includes(Input.mapping[input]);
        }
    }
    static setMapping() { }
    addInput(input) {
        if (!Input.keys.includes(input))
            Input.keys.push(input);
    }
    removeInput(input) {
        if (Input.keys.includes(input))
            Input.keys.splice(Input.keys.indexOf(input), 1);
    }
    onPointerDown(e) {
        // console.log('pointerdown', e)
        this.addInput(e.button);
    }
    onPointerUp(e) {
        // console.log('pointerup', e)
        this.removeInput(e.button);
    }
    onKeyDown(e) {
        // console.log('keydown', e.key, e.code, e.keyCode, e)
        this.addInput(e.keyCode);
    }
    onKeyUp(e) {
        // console.log('keyup', e.key, e.code, e.keyCode, e)
        this.removeInput(e.keyCode);
    }
}
exports.Input = Input;
/** Flag wheather mouse is pressed or not */
Input.isMouseDown = false;
/** List of binded actions with their keys. */
Input.mapping = {
    forward: EKey.W,
    back: EKey.S,
    left: EKey.A,
    right: EKey.D,
    jump: EKey.Space,
    interact: EKey.Enter,
    run: EKey.Shift,
};
//# sourceMappingURL=input.js.map