import { spawn } from "child_process";
import process from "node:process";
import { ChildProcessWithoutNullStreams } from "child_process";
import { EventBus } from "@estates/event-bus";
import { EventEmitter } from "events";

export class serviceProcessSpawner {
    serviceManagerProcess?: ChildProcessWithoutNullStreams;
    eventBus = EventBus.getInstance();
    private emitter: EventEmitter;

    constructor () {
        this.emitter = new EventEmitter();
    }

    async startProcess() {
        return new Promise<number | undefined >((res,rej) => {
            // eslint-disable-next-line no-undef
            const serviceManagerProcess = spawn("ts-node", [__dirname + "/start.ts"]);
            serviceManagerProcess.stdout.pipe(process.stdout);

            serviceManagerProcess.on("close", (code: number) => {
                console.log(`ServiceManager process exited with code ${code}`);
            });
            serviceManagerProcess.stderr.on("data", (data: unknown) => {
                rej(`ServiceManager stderr: ${data}`);
            });
            this.serviceManagerProcess = serviceManagerProcess;
        });
    }
    stopProcess() {
        console.log("killing process");
        this.serviceManagerProcess?.kill(1);
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
