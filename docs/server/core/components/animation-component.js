"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationComponent = void 0;
class AnimationComponent {
    constructor(animation) {
        this.animation = animation;
        // Animation
        // o.scale.x = Math.sin(Tone.context.currentTime) + 1.5
        // o.scale.y = Math.cos(Tone.context.currentTime) + 2
        // o.scale.z = Math.sin(Tone.context.currentTime) + 1.5
        // o.updateMatrix()
        // getScale(
        //     getNote('F' + Math.round((Math.random() * 3) + 1)),
        //     AEOLIAN_SCALE
        // )[Math.round(Math.random() * AEOLIAN_SCALE.length)].frequency
        // this.oscillator.type = ['sine', 'triangle', 'square', 'sawtooth'][Math.floor(Math.random() * 4)] as OscillatorType
        // const d = this.position.distanceTo(position)
        // if(d > this.range) {
        //     if(this.gain.gain.value == 0) return
        //     this.gain.gain.setValueAtTime(0, delta)
        // }
        // else {
        //     let gain = M.map(d, 0, this.range, .7, 0)
        //     if(this.gain.gain.value == gain) return
        //     this.gain.gain.setValueAtTime(gain, delta)
        // }
    }
}
exports.AnimationComponent = AnimationComponent;
//# sourceMappingURL=animation-component.js.map