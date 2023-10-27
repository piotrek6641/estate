export type logPrompt = {
    message: string,
    object?: unknown
}
enum logLevel {
    "debug" = "debug",
    "info" = "info",
    "error" = "error",
    "warning" = "warning"
}
export type LogLevelStrings = keyof typeof logLevel;
