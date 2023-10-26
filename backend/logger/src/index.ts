// eslint-disable-next-line @typescript-eslint/no-var-requires
const chalk = require("chalk");
import { Writable } from "stream";
import { LogLevelStrings } from "types";
export class Logger {
    private serviceName: string;
    public logStream;
    constructor(serviceName: string) {
        this.serviceName = serviceName;
        this.logStream = new Writable({
            write(chunk, encoding, callack) {
                console.log(chunk.toString());
                callack();
            },
        });
        process.stdout.pipe(this.logStream);
    }
    public pipe(logger: Logger) {
        process.stdout.pipe(logger.logStream);
    }

    public log(message: string, logLevel: LogLevelStrings) {
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

        console.log(`[${timestamp}] [${chalk.magenta(this.serviceName)}] [${colorFunction(logLevel.toUpperCase())}] ${message}`);
    }
    public info(message: string) {
        this.log(message, "info");
    }
    public debug(message: string) {
        this.log(message, "debug");
    }
    public error(message: string) {
        this.log(message, "error");
    }
    public warning(message: string) {
        this.log(message, "warning");
    }
}


