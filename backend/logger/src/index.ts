import * as pino from "pino";

export default function createLogger(serviceName: any) {

    const customSerializer = (log: any) => {
        return {
        serviceName,
        ...log,
        };
    };

    const logger = pino.pino({
        serializers: {
            customSerializer
        },
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true
                }
            }
    });
    return logger
}
export class CustomLogger {
    customSerializer: any;
    serviceName: string;
    logger: any;
    constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.customSerializer = (log: any) => {
        return {
        serviceName,
        ...log,
        };
    };
    this.logger = pino.pino({
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true
                }
            }
        });
    }

    log(level: string, message: any, data?: any) {
        const logData = {
        serviceName: this.serviceName,
        data,
        };

        this.logger[level](logData, message);
    }

    info(message: any, data?: any) {
        this.log('info', message, data);
    }

    error(message: any, data?: any) {
        this.log('error', message, data);
    }
  }

