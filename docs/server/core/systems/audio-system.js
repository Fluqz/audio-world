"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioSystem = void 0;
const system_1 = require("./system");
const audio_component_1 = require("../components/audio-component");
const transformation_component_1 = require("../components/transformation-component");
const game_1 = require("../../game/game");
const Tone = __importStar(require("tone"));
class AudioSystem extends system_1.System {
    // Master should not be in game should it?
    get master() { return game_1.Game.master; }
    get volumeRange() { return Math.abs(this.maxdB - this.mindB); }
    constructor(listener) {
        super();
        this.mindB = -80;
        this.maxdB = 0;
        this.listener = listener;
    }
    update(ecs, delta) {
        // entities = Entity.filterByComponents(entities, this.requiredComponents)
        for (let [e, [audio, transform]] of ecs.queryEntities(audio_component_1.AudioComponent, transformation_component_1.TransformationComponent)) {
            this.updatePositionalAudio(e, audio, transform);
        }
    }
    updatePositionalAudio(e, audio, transform) {
        // Instead of distance to center point,
        // use distance to min max of boundingbox 
        const distance = transform.position.distanceTo(this.listener.transform.position);
        // MUTE
        if (distance > audio.range) {
            // Volume
            // if(audio.source.volume.volume.value == Number.NEGATIVE_INFINITY) return
            // audio.source.volume.volume.value = Number.NEGATIVE_INFINITY
            if (audio.connected) {
                audio.source.volume.volume.value = this.mindB;
                // audio.disconnect()
            }
            if (audio.source.volume.volume.value == this.mindB)
                return;
            // Using gain instead of volume
            // if(audio.source.gain.gain.value == 0) return
            // audio.source.gain.gain.value = 0
            audio.source.volume.volume.value = this.mindB;
        }
        else { // UNMUTE
            if (audio.connected == false)
                audio.connect(this.master);
            // // Reverse Cool!
            // let volume = M.map(d, 0, this.audio.range, this.mindB, this.maxdB) 
            let volume = this.distanceTodB(distance, .01, audio.range, -50, this.maxdB);
            // Using gain instead of volume
            // let gain = M.map(d, 0, this.audio.range, 1, 0)
            // if(this.audio.source.gain.gain.value == gain) return
            if (audio.source.volume.volume.value == volume)
                return;
            // audio.source.gain.gain.value = gain
            audio.source.volume.volume.setValueAtTime(volume, Tone.now());
        }
    }
    distanceTodB(distance, minDistance = .1, maxDistance = 50.0, mindB = -80.0, maxdB = 0.0) {
        if (distance <= minDistance)
            return maxdB; // Full volume
        if (distance >= maxDistance)
            return mindB; // Silent
        const t = (distance - minDistance) / (maxDistance - minDistance); // Normalized [0, 1]
        return (1 - t) * (maxdB - mindB) + mindB; // Linearly interpolate dB
    }
}
exports.AudioSystem = AudioSystem;
//# sourceMappingURL=audio-system.js.map