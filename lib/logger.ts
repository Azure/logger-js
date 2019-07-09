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
  logInfo(text: string | string[]): Promise<unknown>;

  /**
   * Log the provided text as an error.
   * @param text The text to log.
   */
  logError(text: string | string[]): Promise<unknown>;

  /**
   * Log the provided text as a warning.
   * @param text The text to log.
   */
  logWarning(text: string | string[]): Promise<unknown>;

  /**
   * Log the provided text as a section header.
   * @param text The text to log.
   */
  logSection(text: string | string[]): Promise<unknown>;

  /**
   * Log the provided text as a verbose log.
   * @param text The text to log.
   */
  logVerbose(text: string | string[]): Promise<unknown>;
}

function addPrefix(text: string | string[], prefix: string | (() => string)): string[] {
  text = toArray(text);
  const prefixText: string = typeof prefix === "string" ? prefix : prefix();
  if (prefixText) {
    text = text.map((textElement: string) => `${prefixText}${textElement}`);
  }
  return text;
}

/**
 * Add the provided prefix to each message logged through the resulting Logger.
 * @param toWrap The Logger to wrap.
 * @param prefix The prefix to add to each log message.
 */
export function prefix(toWrap: Logger, prefix: string | (() => string)): Logger {
  return {
    logInfo: (text: string | string[]) => toWrap.logInfo(addPrefix(text, prefix)),
    logError: (text: string | string[]) => toWrap.logError(addPrefix(text, prefix)),
    logWarning: (text: string | string[]) => toWrap.logWarning(addPrefix(text, prefix)),
    logSection: (text: string | string[]) => toWrap.logSection(addPrefix(text, prefix)),
    logVerbose: (text: string | string[]) => toWrap.logVerbose(addPrefix(text, prefix)),
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
      logInfo: (text: string | string[]) => Promise.all(definedLoggers.map((logger: Logger) => logger.logInfo(text))),
      logError: (text: string | string[]) => Promise.all(definedLoggers.map((logger: Logger) => logger.logError(text))),
      logWarning: (text: string | string[]) => Promise.all(definedLoggers.map((logger: Logger) => logger.logWarning(text))),
      logSection: (text: string | string[]) => Promise.all(definedLoggers.map((logger: Logger) => logger.logSection(text))),
      logVerbose: (text: string | string[]) => Promise.all(definedLoggers.map((logger: Logger) => logger.logVerbose(text)))
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
  logInfo?: boolean | ((text: string | string[]) => unknown);

  /**
   * Log the provided text as an error.
   * @param text The text to log.
   */
  logError?: boolean | ((text: string | string[]) => unknown);

  /**
   * Log the provided text as a warning.
   * @param text The text to log.
   */
  logWarning?: boolean | ((text: string | string[]) => unknown);

  /**
   * Log the provided text as a section header.
   * @param text The text to log.
   */
  logSection?: boolean | ((text: string | string[]) => unknown);

  /**
   * Log the provided text as a verbose log.
   * @param text The text to log.
   */
  logVerbose?: boolean | ((text: string | string[]) => unknown);

  /**
   * Type of the logger.
   */
  type?: "devops" | "console";
}

export function getLogFunction(optionsFunction: undefined | boolean | ((text: string | string[]) => unknown), normalFunction: (text: string | string[]) => unknown, undefinedUsesNormalFunction = true): (text: string | string[]) => Promise<unknown> {
  let result: ((text: string | string[]) => Promise<unknown>) = () => Promise.resolve();
  if (optionsFunction !== false) {
    if (typeof optionsFunction === "function") {
      result = (text: string | string[]) => Promise.resolve(optionsFunction(text));
    } else if (optionsFunction !== undefined || undefinedUsesNormalFunction) {
      result = (text: string | string[]) => Promise.resolve(normalFunction(text));
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
    logInfo: getLogFunction(options.logInfo, (text: string | string[]) => toWrap.logInfo(text)),
    logError: getLogFunction(options.logError, (text: string | string[]) => toWrap.logError(text)),
    logWarning: getLogFunction(options.logWarning, (text: string | string[]) => toWrap.logWarning(text)),
    logSection: getLogFunction(options.logSection, (text: string | string[]) => toWrap.logSection(text)),
    logVerbose: getLogFunction(options.logVerbose, (text: string | string[]) => toWrap.logVerbose(text), false)
  };
}

function consoleLog(text: string | string[]): Promise<void> {
  text = toArray(text);
  for (const textLine of text) {
    console.log(textLine);
  }
  return Promise.resolve();
}

function consoleError(text: string | string[]): Promise<void> {
  text = toArray(text);
  for (const textLine of text) {
    console.error(textLine);
  }
  return Promise.resolve();
}

/**
 * Get a Logger that will send its logs to the console.
 */
export function getConsoleLogger(options: LoggerOptions = {}): Logger {
  return wrapLogger(
    {
      logInfo: consoleLog,
      logError: consoleError,
      logWarning: consoleLog,
      logSection: consoleLog,
      logVerbose: consoleLog
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
    logInfo: getLogFunction(options.logInfo, (text: string | string[]) => {
      allLogs.push(...toArray(text));
      infoLogs.push(...toArray(text));
    }),
    logError: getLogFunction(options.logError, (text: string | string[]) => {
      allLogs.push(...toArray(text));
      errorLogs.push(...toArray(text));
    }),
    logWarning: getLogFunction(options.logWarning, (text: string | string[]) => {
      allLogs.push(...toArray(text));
      warningLogs.push(...toArray(text));
    }),
    logSection: getLogFunction(options.logSection, (text: string | string[]) => {
      allLogs.push(...toArray(text));
      sectionLogs.push(...toArray(text));
    }),
    logVerbose: getLogFunction(options.logVerbose, (text: string | string[]) => {
      allLogs.push(...toArray(text));
      verboseLogs.push(...toArray(text));
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
    logError: ("logError" in options ? options.logError : (text: string | string[]) => Promise.resolve(console.log(text))),
  });
  return wrapLogger(innerLogger, {
    logError: (text: string | string[]) => innerLogger.logError(addPrefix(text, `##[error]`)),
    logInfo: true,
    logSection: (text: string | string[]) => innerLogger.logSection(addPrefix(text, `##[section]`)),
    logWarning: (text: string | string[]) => innerLogger.logWarning(addPrefix(text, `##[warning]`)),
    logVerbose: true
  });
}

/**
 * Get the default Logger based on the command line arguments.
 * @returns The default Logger based on the command line arguments.
 */
export function getDefaultLogger(options: LoggerOptions = {}): Logger {
  return options.type === "devops" ? getAzureDevOpsLogger(options) : getConsoleLogger(options);
}

/**
 * Prefix the provided logger's logs with a UTC timestamp
 */
export function timestamps(logger: Logger): Logger {
  return prefix(logger, () => `${new Date().toISOString()}: `);
}

/**
 * Prefix the provided logger's logs with line numbers.
 */
export function lineNumbers(logger: Logger, firstLineNumber = 1): Logger {
  let lineNumber: number = firstLineNumber;
  return prefix(logger, () => `${lineNumber++}. `);
}

export function toArray(text: string | string[]): string[] {
  return typeof text === "string" ? [text] : text;
}

export function joinLines(text: string | string[]): string {
  return typeof text === "string" ? text : text.join("\n");
}

/**
 * Get the lines of the provided text.
 * @param text The text to get the lines of.
 */
export function getLines(text: string | undefined): string[] {
  return text == undefined ? [] : text.split(/\r?\n/);
}

/**
 * Individually log each of the lines in the provided text using the provided log function.
 * @param text The text to split and log.
 * @param log The function that will log each of the lines of text.
 */
async function logLines(text: string | string[], log: (text: string | string[]) => unknown): Promise<void> {
  if (text != undefined) {
    const lines: string[] = [];
    for (const textLine of toArray(text)) {
      lines.push(...getLines(textLine));
    }
    await Promise.resolve(log(lines));
  }
}

/**
 * Wrap the provided logger with logic that will split logs into individual lines before they are
 * logged.
 * @param logger The Logger to wrap.
 */
export function splitLines(logger: Logger): Logger {
  return wrapLogger(logger, {
    logError: (text: string | string[]) => logLines(text, logger.logError.bind(logger)),
    logInfo: (text: string | string[]) => logLines(text, logger.logInfo.bind(logger)),
    logSection: (text: string | string[]) => logLines(text, logger.logSection.bind(logger)),
    logVerbose: (text: string | string[]) => logLines(text, logger.logVerbose.bind(logger)),
    logWarning: (text: string | string[]) => logLines(text, logger.logWarning.bind(logger)),
  });
}
