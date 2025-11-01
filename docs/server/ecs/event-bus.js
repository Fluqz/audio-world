"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
class EventBus {
    constructor() {
        /**  */
        this.listeners = new Map();
    }
    on(event, listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(listener);
    }
    off(event, listener) {
        var _a;
        (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.delete(listener);
    }
    emit(event, payload) {
        const listeners = this.listeners.get(event);
        if (!listeners)
            return;
        for (const listener of listeners) {
            listener(payload);
        }
    }
}
exports.EventBus = EventBus;
