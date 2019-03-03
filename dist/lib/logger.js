"use strict";
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Add the provided prefix to each message logged through the resulting Logger.
 * @param toWrap The Logger to wrap.
 * @param prefix The prefix to add to each log message.
 */
function prefix(toWrap, prefix) {
    var prefixFunction = typeof prefix === "string" ? function () { return prefix; } : prefix;
    return {
        logInfo: function (text) { return toWrap.logInfo("" + prefixFunction() + text); },
        logError: function (text) { return toWrap.logError("" + prefixFunction() + text); },
        logWarning: function (text) { return toWrap.logWarning("" + prefixFunction() + text); },
        logSection: function (text) { return toWrap.logSection("" + prefixFunction() + text); },
        logVerbose: function (text) { return toWrap.logVerbose("" + prefixFunction() + text); },
    };
}
exports.prefix = prefix;
/**
 * Indent the messages logged by the resulting Logger.
 * @param toWrap The Logger to wrap.
 * @param indentation The indentation to add to the Logger's messages.
 */
function indent(toWrap, indentation) {
    if (indentation == undefined) {
        indentation = "  ";
    }
    else if (typeof indentation === "number") {
        var spaceCount = indentation;
        indentation = "";
        for (var i = 0; i < spaceCount; ++i) {
            indentation += " ";
        }
    }
    return prefix(toWrap, indentation);
}
exports.indent = indent;
/**
 * Get a logger that will log to each of the provided loggers when it is logged to.
 * @param loggers The loggers to log to.
 */
function getCompositeLogger() {
    var loggers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        loggers[_i] = arguments[_i];
    }
    var result;
    var definedLoggers = loggers.filter(function (logger) { return !!logger; });
    if (definedLoggers.length === 1) {
        result = definedLoggers[0];
    }
    else {
        result = {
            logInfo: function (text) { return Promise.all(definedLoggers.map(function (logger) { return logger.logInfo(text); })); },
            logError: function (text) { return Promise.all(definedLoggers.map(function (logger) { return logger.logError(text); })); },
            logWarning: function (text) { return Promise.all(definedLoggers.map(function (logger) { return logger.logWarning(text); })); },
            logSection: function (text) { return Promise.all(definedLoggers.map(function (logger) { return logger.logSection(text); })); },
            logVerbose: function (text) { return Promise.all(definedLoggers.map(function (logger) { return logger.logVerbose(text); })); }
        };
    }
    return result;
}
exports.getCompositeLogger = getCompositeLogger;
function getLogFunction(optionsFunction, normalFunction, undefinedUsesNormalFunction) {
    if (undefinedUsesNormalFunction === void 0) { undefinedUsesNormalFunction = true; }
    var result = function () { return Promise.resolve(); };
    if (optionsFunction !== false) {
        if (typeof optionsFunction === "function") {
            result = optionsFunction;
        }
        else if (optionsFunction !== undefined || undefinedUsesNormalFunction) {
            result = normalFunction;
        }
    }
    return result;
}
exports.getLogFunction = getLogFunction;
/**
 * Wrap the provided Logger with the provided options.
 * @param toWrap The Logger to wrap.
 * @param options The options that should be applied to the wrapped Logger.
 * @returns The newly created Logger that wraps the provided Logger using the provided options.
 */
function wrapLogger(toWrap, options) {
    return {
        logInfo: getLogFunction(options.logInfo, toWrap.logInfo),
        logError: getLogFunction(options.logError, toWrap.logError),
        logWarning: getLogFunction(options.logWarning, toWrap.logWarning),
        logSection: getLogFunction(options.logSection, toWrap.logSection),
        logVerbose: getLogFunction(options.logVerbose, toWrap.logVerbose, false)
    };
}
exports.wrapLogger = wrapLogger;
/**
 * Get a Logger that will send its logs to the console.
 */
function getConsoleLogger(options) {
    if (options === void 0) { options = {}; }
    return wrapLogger({
        logInfo: function (text) { return Promise.resolve(console.log(text)); },
        logError: function (text) { return Promise.resolve(console.error(text)); },
        logWarning: function (text) { return Promise.resolve(console.log(text)); },
        logSection: function (text) { return Promise.resolve(console.log(text)); },
        logVerbose: function (text) { return Promise.resolve(console.log(text)); }
    }, options);
}
exports.getConsoleLogger = getConsoleLogger;
/**
 * Get a Logger that will store its logs in memory.
 */
function getInMemoryLogger(options) {
    if (options === void 0) { options = {}; }
    var allLogs = [];
    var infoLogs = [];
    var errorLogs = [];
    var warningLogs = [];
    var sectionLogs = [];
    var verboseLogs = [];
    return {
        allLogs: allLogs,
        infoLogs: infoLogs,
        errorLogs: errorLogs,
        warningLogs: warningLogs,
        sectionLogs: sectionLogs,
        verboseLogs: verboseLogs,
        logInfo: getLogFunction(options.logInfo, function (text) {
            allLogs.push(text);
            infoLogs.push(text);
            return Promise.resolve();
        }),
        logError: getLogFunction(options.logError, function (text) {
            allLogs.push(text);
            errorLogs.push(text);
            return Promise.resolve();
        }),
        logWarning: getLogFunction(options.logWarning, function (text) {
            allLogs.push(text);
            warningLogs.push(text);
            return Promise.resolve();
        }),
        logSection: getLogFunction(options.logSection, function (text) {
            allLogs.push(text);
            sectionLogs.push(text);
            return Promise.resolve();
        }),
        logVerbose: getLogFunction(options.logVerbose, function (text) {
            allLogs.push(text);
            verboseLogs.push(text);
            return Promise.resolve();
        }, false)
    };
}
exports.getInMemoryLogger = getInMemoryLogger;
/**
 * Get a Logger that will output prefixes for certain types of logs in the Azure DevOps environment.
 */
function getAzureDevOpsLogger(options) {
    if (options === void 0) { options = {}; }
    var innerLogger = options.toWrap || getConsoleLogger(tslib_1.__assign({}, options, { logError: ("logError" in options ? options.logError : function (text) { return Promise.resolve(console.log(text)); }) }));
    return wrapLogger(innerLogger, {
        logError: function (text) { return innerLogger.logError("##[error]" + text); },
        logInfo: true,
        logSection: function (text) { return innerLogger.logSection("##[section]" + text); },
        logWarning: function (text) { return innerLogger.logWarning("##[warning]" + text); },
        logVerbose: true
    });
}
exports.getAzureDevOpsLogger = getAzureDevOpsLogger;
//# sourceMappingURL=logger.js.map