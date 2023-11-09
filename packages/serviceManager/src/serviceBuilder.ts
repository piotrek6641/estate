import { ServiceManager } from ".";
import { EventEmitter } from "events";

export class ServiceBuilder {
    private serviceManager: ServiceManager | undefined;
    private emitter: EventEmitter;

    constructor () {
        this.emitter = new EventEmitter();
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
            this.emitter.on("finished", () => {
                res("finished");
            });
        });
    }
    emit(eventName: string, data?: string) {
        console.log(eventName);
        this.emitter.emit(eventName, data);
    }
}
