import * as pino from "pino";

const Logger = pino.pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
            }
        }
});
export default Logger;
