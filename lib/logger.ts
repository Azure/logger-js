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
export function prefix(toWrap: Logger, prefix: string | (() => string)): Logger {
  const prefixFunction: (() => string) = typeof prefix === "string" ? () => prefix : prefix;
  return {
    logInfo: (text: string) => toWrap.logInfo(`${prefixFunction()}${text}`),
    logError: (text: string) => toWrap.logError(`${prefixFunction()}${text}`),
    logWarning: (text: string) => toWrap.logWarning(`${prefixFunction()}${text}`),
    logSection: (text: string) => toWrap.logSection(`${prefixFunction()}${text}`),
    logVerbose: (text: string) => toWrap.logVerbose(`${prefixFunction()}${text}`),
  };
}

/**
 * Indent the messages logged by the resulting Logger.
 * @param toWrap The Logger to wrap.
 * @param indentation The indentation to add to the Logger's messages.
 */
export function indent(toWrap: Logger, indentation?: string | number): Logger {
  if (indentation == undefined) {
    indentation = "  ";
  } else if (typeof indentation === "number") {
    const spaceCount: number = indentation;
    indentation = "";
    for (let i = 0; i < spaceCount; ++i) {
      indentation += " ";
    }
  }
  return prefix(toWrap, indentation);
}

/**
 * Get a logger that will log to each of the provided loggers when it is logged to.
 * @param loggers The loggers to log to.
 */
export function getCompositeLogger(...loggers: (Logger | undefined)[]): Logger {
  let result: Logger;
  const definedLoggers: Logger[] = loggers.filter((logger: Logger | undefined) => !!logger) as Logger[];
  if (definedLoggers.length === 1) {
    result = definedLoggers[0];
  } else {
    result = {
      logInfo: (text: string) => Promise.all(definedLoggers.map((logger: Logger) => logger.logInfo(text))),
      logError: (text: string) => Promise.all(definedLoggers.map((logger: Logger) => logger.logError(text))),
      logWarning: (text: string) => Promise.all(definedLoggers.map((logger: Logger) => logger.logWarning(text))),
      logSection: (text: string) => Promise.all(definedLoggers.map((logger: Logger) => logger.logSection(text))),
      logVerbose: (text: string) => Promise.all(definedLoggers.map((logger: Logger) => logger.logVerbose(text)))
    };
  }
  return result;
}

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

export function getLogFunction(optionsFunction: undefined | boolean | ((text: string) => Promise<unknown>), normalFunction: (text: string) => Promise<unknown>, undefinedUsesNormalFunction = true): (text: string) => Promise<unknown> {
  let result: ((text: string) => Promise<unknown>) = () => Promise.resolve();
  if (optionsFunction !== false) {
    if (typeof optionsFunction === "function") {
      result = optionsFunction;
    } else if (optionsFunction !== undefined || undefinedUsesNormalFunction) {
      result = normalFunction;
    }
  }
  return result;
}

/**
 * Wrap the provided Logger with the provided options.
 * @param toWrap The Logger to wrap.
 * @param options The options that should be applied to the wrapped Logger.
 * @returns The newly created Logger that wraps the provided Logger using the provided options.
 */
export function wrapLogger(toWrap: Logger, options: LoggerOptions): Logger {
  return {
    logInfo: getLogFunction(options.logInfo, toWrap.logInfo),
    logError: getLogFunction(options.logError, toWrap.logError),
    logWarning: getLogFunction(options.logWarning, toWrap.logWarning),
    logSection: getLogFunction(options.logSection, toWrap.logSection),
    logVerbose: getLogFunction(options.logVerbose, toWrap.logVerbose, false)
  };
}

/**
 * Get a Logger that will send its logs to the console.
 */
export function getConsoleLogger(options: LoggerOptions = {}): Logger {
  return wrapLogger(
    {
      logInfo: (text: string) => Promise.resolve(console.log(text)),
      logError: (text: string) => Promise.resolve(console.error(text)),
      logWarning: (text: string) => Promise.resolve(console.log(text)),
      logSection: (text: string) => Promise.resolve(console.log(text)),
      logVerbose: (text: string) => Promise.resolve(console.log(text))
    },
    options);
}

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
export function getInMemoryLogger(options: LoggerOptions = {}): InMemoryLogger {
  const allLogs: string[] = [];
  const infoLogs: string[] = [];
  const errorLogs: string[] = [];
  const warningLogs: string[] = [];
  const sectionLogs: string[] = [];
  const verboseLogs: string[] = [];
  return {
    allLogs,
    infoLogs,
    errorLogs,
    warningLogs,
    sectionLogs,
    verboseLogs,
    logInfo: getLogFunction(options.logInfo, (text: string) => {
      allLogs.push(text);
      infoLogs.push(text);
      return Promise.resolve();
    }),
    logError: getLogFunction(options.logError, (text: string) => {
      allLogs.push(text);
      errorLogs.push(text);
      return Promise.resolve();
    }),
    logWarning: getLogFunction(options.logWarning, (text: string) => {
      allLogs.push(text);
      warningLogs.push(text);
      return Promise.resolve();
    }),
    logSection: getLogFunction(options.logSection, (text: string) => {
      allLogs.push(text);
      sectionLogs.push(text);
      return Promise.resolve();
    }),
    logVerbose: getLogFunction(options.logVerbose, (text: string) => {
      allLogs.push(text);
      verboseLogs.push(text);
      return Promise.resolve();
    }, false)
  };
}

export interface AzureDevOpsLoggerOptions extends LoggerOptions {
  toWrap?: Logger;
}

/**
 * Get a Logger that will output prefixes for certain types of logs in the Azure DevOps environment.
 */
export function getAzureDevOpsLogger(options: AzureDevOpsLoggerOptions = {}): Logger {
  const innerLogger: Logger = options.toWrap || getConsoleLogger({
    ...options,
    logError: ("logError" in options ? options.logError : (text: string) => Promise.resolve(console.log(text))),
  });
  return wrapLogger(innerLogger, {
    logError: (text: string) => innerLogger.logError(`##[error]${text}`),
    logInfo: true,
    logSection: (text: string) => innerLogger.logSection(`##[section]${text}`),
    logWarning: (text: string) => innerLogger.logWarning(`##[warning]${text}`),
    logVerbose: true
  });
}
