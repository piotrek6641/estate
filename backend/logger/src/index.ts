// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require("chalk");
import { Writable } from "stream";
import { inspect } from "util";
import { logPrompt, LogLevelStrings} from "./types";
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
    public info(message: logPrompt) {
        this.log(message.message, "info", message.object);
    }
    public debug(message: logPrompt) {
        this.log(message.message, "debug", message.object);
    }
    public error(message: logPrompt) {
        this.log(message.message, "error", message.object);
    }
    public warning(message: logPrompt) {
        this.log(message.message, "warning", message.object);
    }
}


