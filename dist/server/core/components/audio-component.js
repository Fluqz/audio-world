"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioComponent = void 0;
class AudioComponent {
    constructor(source, effects, range) {
        this.source = source;
        this.effects = effects;
        this.range = range;
        // if(effects == undefined) 
        this.output = source.output;
        // else this.output = effects[effects.length-1].output
        this.connected = false;
    }
    connect(node) {
        this.output.connect(node);
        this.connected = true;
    }
    disconnect(node) {
        if (node)
            this.output.disconnect(node);
        else
            this.output.disconnect();
        this.connected = false;
    }
}
exports.AudioComponent = AudioComponent;
//# sourceMappingURL=audio-component.js.map