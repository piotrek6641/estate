import { spawn } from "child_process";
import process from "node:process";
import { ChildProcessWithoutNullStreams } from "child_process";
import { EventBus } from "@estates/event-bus";
import { EventEmitter } from "events";

export class serviceProcessSpawner {
    // eslint-disable-next-line no-use-before-define
    private static instance: serviceProcessSpawner;
    serviceManagerProcess?: ChildProcessWithoutNullStreams;
    eventBus = EventBus.getInstance();
    private emitter: EventEmitter;
    public isFinished = new Promise<void>((res, rej) => {});

    private constructor () {
        this.emitter = new EventEmitter();
        this.emitter.on("finished", () => {
            this.isFinished = Promise.resolve();
        });
    }

    public static getInstance(): serviceProcessSpawner {
        if (!serviceProcessSpawner.instance) {
            serviceProcessSpawner.instance = new serviceProcessSpawner();
        }

        return serviceProcessSpawner.instance;
    }

    startProcess() {
        return new Promise<void>((res,_rej) => {
            // eslint-disable-next-line no-undef
            const serviceManagerProcess = spawn("ts-node", [__dirname + "/start.ts"]);
            serviceManagerProcess.stdout.pipe(process.stdout);
            serviceManagerProcess.on("close", (code: number) => {
                console.log(`ServiceManager process exited with code ${code}`);
            });
            serviceManagerProcess.stderr.on("data", (data: unknown) => {
                throw new Error(`ServiceManager stderr: ${data}`);
            });
            this.serviceManagerProcess = serviceManagerProcess;
            res();
        });

    }
    stopProcess() {
        console.log("killing process");
        this.serviceManagerProcess?.kill(1);
    }
    emit(eventName: string, data?: string) {
        console.log(eventName);
        this.emitter.emit(eventName, data);
    }
}
