/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import chalk from "chalk";
import { Writable } from "stream";
import { inspect } from "util";
import { logPrompt, LogLevelStrings} from "./types";
import { Buffer } from "buffer";
export class Logger {
    private serviceName: string;
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
    public pipe(logger: Logger) {
        logger.logStream.pipe(this.logStream);
    }

    public log(message: string, logLevel: LogLevelStrings, object?: unknown) {
        const timestamp = new Date().toISOString();

        let colorFunction;
        switch (logLevel) {
        case "info":
            colorFunction = chalk.blue;
            break;
        case "debug":
            colorFunction = chalk.blueBright;
            break;
        case "warning":
            colorFunction = chalk.yellow;
            break;
        case "error":
            colorFunction = chalk.red;
            break;
        default:
            colorFunction = chalk.white;
        }

        this.logStream.write(`[${chalk.green(timestamp)}] [${chalk.magenta(this.serviceName)}] [${colorFunction(logLevel.toUpperCase())}] ${message}${object !== undefined ? ` ${inspect(object, { depth: null, colors: true, compact: true })}` : ""}`);
    }
    public info: logPrompt = (message, object) => {
        this.log(message, "info", object);
    };
    public debug: logPrompt = (message, object) => {
        this.log(message, "debug", object);
    };
    public error: logPrompt = (message, object) => {
        this.log(message, "error", object);
    };
    public warning: logPrompt = (message, object) => {
        this.log(message, "warning", object);
    };
}


