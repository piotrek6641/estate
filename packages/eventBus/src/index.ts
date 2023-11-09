import { EventEmitter } from "events";

interface EventCallback {
    // eslint-disable-next-line no-unused-vars
    (data: unknown): void;
}

interface EventMap {
    [key: string]: EventCallback[];
}

export class EventBus {
    // eslint-disable-next-line no-use-before-define
    private static instance: EventBus;
    private emitter: EventEmitter;
    private events: EventMap = {};

    private constructor() {
        this.emitter = new EventEmitter();
    }

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    public subscribe(eventType: string, callback: EventCallback): void {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
            this.emitter.on(eventType, (data: unknown) => {
                this.events[eventType].forEach((cb) => cb(data));
            });
        }
        this.events[eventType].push(callback);
    }

    public publish(eventType: string, data: unknown): void {
        this.emitter.emit(eventType, data);
    }
}
