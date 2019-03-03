/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */
/**
 * An interface for an object that writes logs.
 */
export interface Logger {
    /**
     * Log the provided text as informational.
     * @param text The text to log.
     */
    logInfo(text: string): Promise<unknown>;
    /**
     * Log the provided text as an error.
     * @param text The text to log.
     */
    logError(text: string): Promise<unknown>;
    /**
     * Log the provided text as a warning.
     * @param text The text to log.
     */
    logWarning(text: string): Promise<unknown>;
    /**
     * Log the provided text as a section header.
     * @param text The text to log.
     */
    logSection(text: string): Promise<unknown>;
    /**
     * Log the provided text as a verbose log.
     * @param text The text to log.
     */
    logVerbose(text: string): Promise<unknown>;
}
/**
 * Add the provided prefix to each message logged through the resulting Logger.
 * @param toWrap The Logger to wrap.
 * @param prefix The prefix to add to each log message.
 */
export declare function prefix(toWrap: Logger, prefix: string | (() => string)): Logger;
/**
 * Indent the messages logged by the resulting Logger.
 * @param toWrap The Logger to wrap.
 * @param indentation The indentation to add to the Logger's messages.
 */
export declare function indent(toWrap: Logger, indentation?: string | number): Logger;
/**
 * Get a logger that will log to each of the provided loggers when it is logged to.
 * @param loggers The loggers to log to.
 */
export declare function getCompositeLogger(...loggers: (Logger | undefined)[]): Logger;
/**
 * The options that can be provided when creating a Logger.
 */
export interface LoggerOptions {
    /**
     * Log the provided text as informational.
     * @param text The text to log.
     */
    logInfo?: boolean | ((text: string) => Promise<unknown>);
    /**
     * Log the provided text as an error.
     * @param text The text to log.
     */
    logError?: boolean | ((text: string) => Promise<unknown>);
    /**
     * Log the provided text as a warning.
     * @param text The text to log.
     */
    logWarning?: boolean | ((text: string) => Promise<unknown>);
    /**
     * Log the provided text as a section header.
     * @param text The text to log.
     */
    logSection?: boolean | ((text: string) => Promise<unknown>);
    /**
     * Log the provided text as a verbose log.
     * @param text The text to log.
     */
    logVerbose?: boolean | ((text: string) => Promise<unknown>);
}
export declare function getLogFunction(optionsFunction: undefined | boolean | ((text: string) => Promise<unknown>), normalFunction: (text: string) => Promise<unknown>, undefinedUsesNormalFunction?: boolean): (text: string) => Promise<unknown>;
/**
 * Wrap the provided Logger with the provided options.
 * @param toWrap The Logger to wrap.
 * @param options The options that should be applied to the wrapped Logger.
 * @returns The newly created Logger that wraps the provided Logger using the provided options.
 */
export declare function wrapLogger(toWrap: Logger, options: LoggerOptions): Logger;
/**
 * Get a Logger that will send its logs to the console.
 */
export declare function getConsoleLogger(options?: LoggerOptions): Logger;
/**
 * A Logger that will store its logs in memory.
 */
export interface InMemoryLogger extends Logger {
    /**
     * All of the logs that have been written to this Logger.
     */
    allLogs: string[];
    /**
     * The informational logs that have been written to this Logger.
     */
    infoLogs: string[];
    /**
     * The error logs that have been written to this Logger.
     */
    errorLogs: string[];
    /**
     * The warning logs that have been written to this Logger.
     */
    warningLogs: string[];
    /**
     * The section header logs that have been written to this Logger.
     */
    sectionLogs: string[];
    /**
     * The verbose logs that have been written to this Logger.
     */
    verboseLogs: string[];
}
/**
 * Get a Logger that will store its logs in memory.
 */
export declare function getInMemoryLogger(options?: LoggerOptions): InMemoryLogger;
export interface AzureDevOpsLoggerOptions extends LoggerOptions {
    toWrap?: Logger;
}
/**
 * Get a Logger that will output prefixes for certain types of logs in the Azure DevOps environment.
 */
export declare function getAzureDevOpsLogger(options?: AzureDevOpsLoggerOptions): Logger;
//# sourceMappingURL=logger.d.ts.map