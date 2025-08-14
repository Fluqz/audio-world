"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameComponent = void 0;
class NameComponent {
    constructor(name) {
        this.name = name;
    }
    serialize() {
        return {
            name: this.name
        };
    }
}
exports.NameComponent = NameComponent;
