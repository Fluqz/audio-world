
export type EventType = 'component-added' | 'component-removed' | 'entity-added' | 'entity-removed' | 'system-registered' | 'system-unregistered'

type Listener<T = any> = (payload: T) => void

export class EventBus {

    /**  */
    private listeners: Map<EventType, Set<Listener>> = new Map()

    on<T = any>(event: EventType, listener: Listener<T>) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }
        this.listeners.get(event)!.add(listener)
    }

    off<T = any>(event: EventType, listener: Listener<T>) {
        this.listeners.get(event)?.delete(listener)
    }

    emit<T = any>(event: EventType, payload: T) {
        const listeners = this.listeners.get(event)
        if (!listeners) return
        for (const listener of listeners) {
            listener(payload)
        }
    }
}
