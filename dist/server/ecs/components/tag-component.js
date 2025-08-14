"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagComponent = void 0;
class TagComponent {
    constructor(tagName) {
        this.tagName = tagName;
    }
    serialize() {
        return {
            tagName: this.tagName
        };
    }
}
exports.TagComponent = TagComponent;
