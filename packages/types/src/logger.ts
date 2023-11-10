/* eslint-disable no-unused-vars */
export type logPrompt = (message: string, object?: unknown) => void;
export enum logLevel {
    "debug" = "debug",
    "info" = "info",
    "error" = "error",
    "warning" = "warning"
}
export type LogLevelStrings = keyof typeof logLevel;


import { Writable } from "stream";
export interface ILogger {
    serviceName: string;
    logStream: Writable;

    pipe(logger: ILogger) :void
    log(message: string, logLevel: LogLevelStrings, object?: unknown): void

    info(message: string, object?:unknown ): void;
    debug(message: string, object?:unknown ): void;
    error(message: string, object?:unknown ): void;
    warning(message: string, object?:unknown ): void;
}

