import { ServiceManager } from ".";
import { EventEmitter } from "events";
import { serviceProcessSpawner } from "./serviceProcessSpawner";

export class ServiceBuilder {
    // eslint-disable-next-line no-use-before-define
    private static instance: ServiceBuilder;
    private serviceManager: ServiceManager | undefined;
    private emitter: EventEmitter;
    private isFinished: boolean = false;
    public processSpawner?: serviceProcessSpawner;

    private constructor () {
        this.emitter = new EventEmitter();
        this.emitter.on("finished", () => {
            this.isFinished = true;
        },
        );
    }
    public static getInstance(): ServiceBuilder {
        if (!ServiceBuilder.instance) {
            ServiceBuilder.instance = new ServiceBuilder();
        }

        return ServiceBuilder.instance;
    }

    public buildServiceManager() {
        this.serviceManager = new ServiceManager();
    }
    public async startServiceManager() {
        if (!this.serviceManager) throw new Error("unable to start Service Manager before initiation");
        try {
            await this.serviceManager.start();
        } catch (e) {
            console.error(e);
        }
    }
    public getServiceManager() {
        return this.serviceManager;
    }
    public async waitForFinishBooting() {
        return new Promise<unknown>((res, _rej) => {
            const timer = setInterval(() => {
                if (this.isFinished) {
                    res("finished");
                    clearInterval(timer);
                }
            }, 500);
        });
    }
    emit(eventName: string, data?: string) {
        this.emitter.emit(eventName, data);
    }
}
