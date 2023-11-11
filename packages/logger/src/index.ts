/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { ILogger } from "@estates/types";
import chalk from "chalk";
import { Writable } from "stream";
import { inspect } from "util";
import { logPrompt, LogLevelStrings } from "./types";
import { Buffer } from "buffer";
export class Logger implements ILogger {
    public serviceName: string;
    public logStream;
    constructor(serviceName: string) {
        this.serviceName = serviceName;
        this.logStream = new Writable({
            write(chunk: Buffer, _encoding, callback) {
                console.log(chunk.toString());
                callback();
            },
        });
    }
    public pipe(logger: ILogger) {
        logger.logStream.pipe(this.logStream);
    }
    private getColorFunction(logLevel: LogLevelStrings) {
        switch (logLevel) {
        case "info":
            return chalk.blue;
        case "debug":
            return chalk.blueBright;
        case "warning":
            return chalk.yellow;
        case "error":
            return chalk.red;
        default:
            return chalk.white;
        }
    }
    private stringifyObject(object: unknown) {
        if (typeof object === "object" && object !== null) {
            return inspect(object, { depth: null, colors: true, compact: true });
        } else if (!object) return "null";
        return object.toString();

    }

    public log(message: string, logLevel: LogLevelStrings, ...args: unknown[]) {
        const timestamp = new Date().toISOString();
        const colorFunction = this.getColorFunction(logLevel);
        const formattedObject = args.map((arg) => this.stringifyObject(arg)).join(" ");
        this.logStream.write(`[${chalk.green(timestamp)}] [${chalk.magenta(this.serviceName)}] [${colorFunction(logLevel.toUpperCase())}] ${message} ${formattedObject}`);
    }
    public info: logPrompt = (message, ...args) => {
        this.log(message, "info", ...args);
    };

    public debug: logPrompt = (message, ...args) => {
        this.log(message, "debug", ...args);
    };

    public error: logPrompt = (message, ...args) => {
        this.log(message, "error", ...args);
    };

    public warning: logPrompt = (message, ...args) => {
        this.log(message, "warning", ...args);
    };
}


