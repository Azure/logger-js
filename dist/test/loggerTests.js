"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var azure_js_dev_tools_1 = require("@ts-common/azure-js-dev-tools");
var logger_1 = require("../lib/logger");
describe("logger.ts", function () {
    describe("getCompositeLogger()", function () {
        it("with no arguments", function () {
            var logger = logger_1.getCompositeLogger();
            azure_js_dev_tools_1.assertEx.defined(logger, "logger");
        });
        it("with no defined arguments", function () {
            var logger = logger_1.getCompositeLogger(undefined, undefined);
            azure_js_dev_tools_1.assertEx.defined(logger, "logger");
        });
        it("with one defined argument", function () {
            var inMemoryLogger = logger_1.getInMemoryLogger();
            var logger = logger_1.getCompositeLogger(undefined, undefined, inMemoryLogger);
            chai_1.assert.strictEqual(logger, inMemoryLogger);
        });
        it("logInfo()", function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var logger1, logger2, logger3, logger;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger1 = logger_1.getInMemoryLogger();
                            logger2 = logger_1.getInMemoryLogger();
                            logger3 = logger_1.getInMemoryLogger({ logInfo: false });
                            logger = logger_1.getCompositeLogger(logger1, logger2, logger3);
                            return [4 /*yield*/, logger.logInfo("test info")];
                        case 1:
                            _a.sent();
                            chai_1.assert.deepEqual(logger1.allLogs, ["test info"]);
                            chai_1.assert.deepEqual(logger1.infoLogs, ["test info"]);
                            chai_1.assert.deepEqual(logger2.allLogs, ["test info"]);
                            chai_1.assert.deepEqual(logger2.infoLogs, ["test info"]);
                            chai_1.assert.deepEqual(logger3.allLogs, []);
                            chai_1.assert.deepEqual(logger3.infoLogs, []);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("logError()", function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var logger1, logger2, logger3, logger;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger1 = logger_1.getInMemoryLogger();
                            logger2 = logger_1.getInMemoryLogger();
                            logger3 = logger_1.getInMemoryLogger({ logError: false });
                            logger = logger_1.getCompositeLogger(logger1, logger2, logger3);
                            return [4 /*yield*/, logger.logError("test error")];
                        case 1:
                            _a.sent();
                            chai_1.assert.deepEqual(logger1.allLogs, ["test error"]);
                            chai_1.assert.deepEqual(logger1.errorLogs, ["test error"]);
                            chai_1.assert.deepEqual(logger2.allLogs, ["test error"]);
                            chai_1.assert.deepEqual(logger2.errorLogs, ["test error"]);
                            chai_1.assert.deepEqual(logger3.allLogs, []);
                            chai_1.assert.deepEqual(logger3.errorLogs, []);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("logSection()", function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var logger1, logger2, logger3, logger;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger1 = logger_1.getInMemoryLogger();
                            logger2 = logger_1.getInMemoryLogger();
                            logger3 = logger_1.getInMemoryLogger({ logSection: false });
                            logger = logger_1.getCompositeLogger(logger1, logger2, logger3);
                            return [4 /*yield*/, logger.logSection("test section")];
                        case 1:
                            _a.sent();
                            chai_1.assert.deepEqual(logger1.allLogs, ["test section"]);
                            chai_1.assert.deepEqual(logger1.sectionLogs, ["test section"]);
                            chai_1.assert.deepEqual(logger2.allLogs, ["test section"]);
                            chai_1.assert.deepEqual(logger2.sectionLogs, ["test section"]);
                            chai_1.assert.deepEqual(logger3.allLogs, []);
                            chai_1.assert.deepEqual(logger3.sectionLogs, []);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("logVerbose()", function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var logger1, logger2, logger3, logger;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger1 = logger_1.getInMemoryLogger({ logVerbose: true });
                            logger2 = logger_1.getInMemoryLogger({ logVerbose: true });
                            logger3 = logger_1.getInMemoryLogger({ logVerbose: false });
                            logger = logger_1.getCompositeLogger(logger1, logger2, logger3);
                            return [4 /*yield*/, logger.logVerbose("test verbose")];
                        case 1:
                            _a.sent();
                            chai_1.assert.deepEqual(logger1.allLogs, ["test verbose"]);
                            chai_1.assert.deepEqual(logger1.verboseLogs, ["test verbose"]);
                            chai_1.assert.deepEqual(logger2.allLogs, ["test verbose"]);
                            chai_1.assert.deepEqual(logger2.verboseLogs, ["test verbose"]);
                            chai_1.assert.deepEqual(logger3.allLogs, []);
                            chai_1.assert.deepEqual(logger3.verboseLogs, []);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("logWarning()", function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var logger1, logger2, logger3, logger;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger1 = logger_1.getInMemoryLogger();
                            logger2 = logger_1.getInMemoryLogger();
                            logger3 = logger_1.getInMemoryLogger({ logWarning: false });
                            logger = logger_1.getCompositeLogger(logger1, logger2, logger3);
                            return [4 /*yield*/, logger.logWarning("test warning")];
                        case 1:
                            _a.sent();
                            chai_1.assert.deepEqual(logger1.allLogs, ["test warning"]);
                            chai_1.assert.deepEqual(logger1.warningLogs, ["test warning"]);
                            chai_1.assert.deepEqual(logger2.allLogs, ["test warning"]);
                            chai_1.assert.deepEqual(logger2.warningLogs, ["test warning"]);
                            chai_1.assert.deepEqual(logger3.allLogs, []);
                            chai_1.assert.deepEqual(logger3.warningLogs, []);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    it("getConsoleLogger()", function () {
        var logger = logger_1.getConsoleLogger();
        chai_1.assert(logger);
        chai_1.assert(logger.logError);
        chai_1.assert(logger.logInfo);
        chai_1.assert(logger.logSection);
        chai_1.assert(logger.logVerbose);
        chai_1.assert(logger.logWarning);
    });
    describe("getAzureDevopsLogger()", function () {
        it("with no options", function () {
            var logger = logger_1.getAzureDevOpsLogger();
            chai_1.assert(logger);
            chai_1.assert(logger.logError);
            chai_1.assert(logger.logInfo);
            chai_1.assert(logger.logSection);
            chai_1.assert(logger.logVerbose);
            chai_1.assert(logger.logWarning);
        });
        it("with empty options", function () {
            var logger = logger_1.getAzureDevOpsLogger({});
            chai_1.assert(logger);
            chai_1.assert(logger.logError);
            chai_1.assert(logger.logInfo);
            chai_1.assert(logger.logSection);
            chai_1.assert(logger.logVerbose);
            chai_1.assert(logger.logWarning);
        });
        it("with toWrap logger", function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var inMemoryLogger, logger;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inMemoryLogger = logger_1.getInMemoryLogger({ logVerbose: true });
                            logger = logger_1.getAzureDevOpsLogger({ toWrap: inMemoryLogger });
                            return [4 /*yield*/, logger.logError("a")];
                        case 1:
                            _a.sent();
                            chai_1.assert.deepEqual(inMemoryLogger.allLogs, ["##[error]a"]);
                            chai_1.assert.deepEqual(inMemoryLogger.errorLogs, ["##[error]a"]);
                            chai_1.assert.deepEqual(inMemoryLogger.infoLogs, []);
                            chai_1.assert.deepEqual(inMemoryLogger.sectionLogs, []);
                            chai_1.assert.deepEqual(inMemoryLogger.warningLogs, []);
                            chai_1.assert.deepEqual(inMemoryLogger.verboseLogs, []);
                            return [4 /*yield*/, logger.logInfo("b")];
                        case 2:
                            _a.sent();
                            chai_1.assert.deepEqual(inMemoryLogger.allLogs, ["##[error]a", "b"]);
                            chai_1.assert.deepEqual(inMemoryLogger.errorLogs, ["##[error]a"]);
                            chai_1.assert.deepEqual(inMemoryLogger.infoLogs, ["b"]);
                            chai_1.assert.deepEqual(inMemoryLogger.sectionLogs, []);
                            chai_1.assert.deepEqual(inMemoryLogger.warningLogs, []);
                            chai_1.assert.deepEqual(inMemoryLogger.verboseLogs, []);
                            return [4 /*yield*/, logger.logSection("c")];
                        case 3:
                            _a.sent();
                            chai_1.assert.deepEqual(inMemoryLogger.allLogs, ["##[error]a", "b", "##[section]c"]);
                            chai_1.assert.deepEqual(inMemoryLogger.errorLogs, ["##[error]a"]);
                            chai_1.assert.deepEqual(inMemoryLogger.infoLogs, ["b"]);
                            chai_1.assert.deepEqual(inMemoryLogger.sectionLogs, ["##[section]c"]);
                            chai_1.assert.deepEqual(inMemoryLogger.warningLogs, []);
                            chai_1.assert.deepEqual(inMemoryLogger.verboseLogs, []);
                            return [4 /*yield*/, logger.logWarning("d")];
                        case 4:
                            _a.sent();
                            chai_1.assert.deepEqual(inMemoryLogger.allLogs, ["##[error]a", "b", "##[section]c", "##[warning]d"]);
                            chai_1.assert.deepEqual(inMemoryLogger.errorLogs, ["##[error]a"]);
                            chai_1.assert.deepEqual(inMemoryLogger.infoLogs, ["b"]);
                            chai_1.assert.deepEqual(inMemoryLogger.sectionLogs, ["##[section]c"]);
                            chai_1.assert.deepEqual(inMemoryLogger.warningLogs, ["##[warning]d"]);
                            chai_1.assert.deepEqual(inMemoryLogger.verboseLogs, []);
                            return [4 /*yield*/, logger.logVerbose("e")];
                        case 5:
                            _a.sent();
                            chai_1.assert.deepEqual(inMemoryLogger.allLogs, ["##[error]a", "b", "##[section]c", "##[warning]d", "e"]);
                            chai_1.assert.deepEqual(inMemoryLogger.errorLogs, ["##[error]a"]);
                            chai_1.assert.deepEqual(inMemoryLogger.infoLogs, ["b"]);
                            chai_1.assert.deepEqual(inMemoryLogger.sectionLogs, ["##[section]c"]);
                            chai_1.assert.deepEqual(inMemoryLogger.warningLogs, ["##[warning]d"]);
                            chai_1.assert.deepEqual(inMemoryLogger.verboseLogs, ["e"]);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("InMemoryLogger", function () {
        it("getInMemoryLogger()", function () {
            var logger = logger_1.getInMemoryLogger();
            chai_1.assert.deepEqual(logger.allLogs, []);
            chai_1.assert.deepEqual(logger.infoLogs, []);
            chai_1.assert.deepEqual(logger.errorLogs, []);
        });
        it("logInfo()", function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var logger;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger = logger_1.getInMemoryLogger();
                            return [4 /*yield*/, logger.logInfo("apples")];
                        case 1:
                            _a.sent();
                            chai_1.assert.deepEqual(logger.allLogs, ["apples"]);
                            chai_1.assert.deepEqual(logger.infoLogs, ["apples"]);
                            chai_1.assert.deepEqual(logger.errorLogs, []);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("logError()", function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var logger;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger = logger_1.getInMemoryLogger();
                            return [4 /*yield*/, logger.logError("bananas")];
                        case 1:
                            _a.sent();
                            chai_1.assert.deepEqual(logger.allLogs, ["bananas"]);
                            chai_1.assert.deepEqual(logger.infoLogs, []);
                            chai_1.assert.deepEqual(logger.errorLogs, ["bananas"]);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("wrapLogger()", function () {
        it("with overridden logInfo()", function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var logger, wrappedLogger;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger = logger_1.getInMemoryLogger();
                            wrappedLogger = logger_1.wrapLogger(logger, {
                                logInfo: function (text) { return logger.logInfo("[INFO] " + text); }
                            });
                            return [4 /*yield*/, wrappedLogger.logInfo("abc")];
                        case 1:
                            _a.sent();
                            chai_1.assert.deepEqual(logger.allLogs, ["[INFO] abc"]);
                            chai_1.assert.deepEqual(logger.infoLogs, ["[INFO] abc"]);
                            chai_1.assert.deepEqual(logger.errorLogs, []);
                            return [4 /*yield*/, wrappedLogger.logError("xyz")];
                        case 2:
                            _a.sent();
                            chai_1.assert.deepEqual(logger.allLogs, ["[INFO] abc", "xyz"]);
                            chai_1.assert.deepEqual(logger.infoLogs, ["[INFO] abc"]);
                            chai_1.assert.deepEqual(logger.errorLogs, ["xyz"]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("with overridden logError()", function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var logger, wrappedLogger;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger = logger_1.getInMemoryLogger();
                            wrappedLogger = logger_1.wrapLogger(logger, {
                                logError: function (text) { return logger.logError("[ERROR] " + text); }
                            });
                            return [4 /*yield*/, wrappedLogger.logInfo("abc")];
                        case 1:
                            _a.sent();
                            chai_1.assert.deepEqual(logger.allLogs, ["abc"]);
                            chai_1.assert.deepEqual(logger.infoLogs, ["abc"]);
                            chai_1.assert.deepEqual(logger.errorLogs, []);
                            return [4 /*yield*/, wrappedLogger.logError("xyz")];
                        case 2:
                            _a.sent();
                            chai_1.assert.deepEqual(logger.allLogs, ["abc", "[ERROR] xyz"]);
                            chai_1.assert.deepEqual(logger.infoLogs, ["abc"]);
                            chai_1.assert.deepEqual(logger.errorLogs, ["[ERROR] xyz"]);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("prefix()", function () {
        it("with empty string", function () {
            var logger = logger_1.getInMemoryLogger({ logVerbose: true });
            var prefixLogger = logger_1.prefix(logger, "");
            prefixLogger.logInfo("a");
            chai_1.assert.deepEqual(logger.allLogs, ["a"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["a"]);
            chai_1.assert.deepEqual(logger.errorLogs, []);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logError("b");
            chai_1.assert.deepEqual(logger.allLogs, ["a", "b"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["b"]);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logWarning("c");
            chai_1.assert.deepEqual(logger.allLogs, ["a", "b", "c"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logSection("d");
            chai_1.assert.deepEqual(logger.allLogs, ["a", "b", "c", "d"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logVerbose("e");
            chai_1.assert.deepEqual(logger.allLogs, ["a", "b", "c", "d", "e"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, ["e"]);
        });
        it("with non-empty string", function () {
            var logger = logger_1.getInMemoryLogger({ logVerbose: true });
            var prefixLogger = logger_1.prefix(logger, "  ");
            prefixLogger.logInfo("a");
            chai_1.assert.deepEqual(logger.allLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.errorLogs, []);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logError("b");
            chai_1.assert.deepEqual(logger.allLogs, ["  a", "  b"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["  b"]);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logWarning("c");
            chai_1.assert.deepEqual(logger.allLogs, ["  a", "  b", "  c"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["  b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["  c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logSection("d");
            chai_1.assert.deepEqual(logger.allLogs, ["  a", "  b", "  c", "  d"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["  b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["  c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["  d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logVerbose("e");
            chai_1.assert.deepEqual(logger.allLogs, ["  a", "  b", "  c", "  d", "  e"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["  b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["  c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["  d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, ["  e"]);
        });
        it("with function", function () {
            var logger = logger_1.getInMemoryLogger({ logVerbose: true });
            var logCount = 0;
            var prefixLogger = logger_1.prefix(logger, function () { return ++logCount + ". "; });
            prefixLogger.logInfo("a");
            chai_1.assert.deepEqual(logger.allLogs, ["1. a"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["1. a"]);
            chai_1.assert.deepEqual(logger.errorLogs, []);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logError("b");
            chai_1.assert.deepEqual(logger.allLogs, ["1. a", "2. b"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["1. a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["2. b"]);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logWarning("c");
            chai_1.assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["1. a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["2. b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["3. c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logSection("d");
            chai_1.assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c", "4. d"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["1. a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["2. b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["3. c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["4. d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            prefixLogger.logVerbose("e");
            chai_1.assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c", "4. d", "5. e"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["1. a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["2. b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["3. c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["4. d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, ["5. e"]);
        });
    });
    describe("indent()", function () {
        it("with empty string", function () {
            var logger = logger_1.getInMemoryLogger({ logVerbose: true });
            var indentedLogger = logger_1.indent(logger, "");
            indentedLogger.logInfo("a");
            chai_1.assert.deepEqual(logger.allLogs, ["a"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["a"]);
            chai_1.assert.deepEqual(logger.errorLogs, []);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logError("b");
            chai_1.assert.deepEqual(logger.allLogs, ["a", "b"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["b"]);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logWarning("c");
            chai_1.assert.deepEqual(logger.allLogs, ["a", "b", "c"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logSection("d");
            chai_1.assert.deepEqual(logger.allLogs, ["a", "b", "c", "d"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logVerbose("e");
            chai_1.assert.deepEqual(logger.allLogs, ["a", "b", "c", "d", "e"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, ["e"]);
        });
        it("with non-empty string", function () {
            var logger = logger_1.getInMemoryLogger({ logVerbose: true });
            var indentedLogger = logger_1.indent(logger, "  ");
            indentedLogger.logInfo("a");
            chai_1.assert.deepEqual(logger.allLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.errorLogs, []);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logError("b");
            chai_1.assert.deepEqual(logger.allLogs, ["  a", "  b"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["  b"]);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logWarning("c");
            chai_1.assert.deepEqual(logger.allLogs, ["  a", "  b", "  c"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["  b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["  c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logSection("d");
            chai_1.assert.deepEqual(logger.allLogs, ["  a", "  b", "  c", "  d"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["  b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["  c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["  d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logVerbose("e");
            chai_1.assert.deepEqual(logger.allLogs, ["  a", "  b", "  c", "  d", "  e"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["  a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["  b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["  c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["  d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, ["  e"]);
        });
        it("with number", function () {
            var logger = logger_1.getInMemoryLogger({ logVerbose: true });
            var indentedLogger = logger_1.indent(logger, 4);
            indentedLogger.logInfo("a");
            chai_1.assert.deepEqual(logger.allLogs, ["    a"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["    a"]);
            chai_1.assert.deepEqual(logger.errorLogs, []);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logError("b");
            chai_1.assert.deepEqual(logger.allLogs, ["    a", "    b"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["    a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["    b"]);
            chai_1.assert.deepEqual(logger.warningLogs, []);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logWarning("c");
            chai_1.assert.deepEqual(logger.allLogs, ["    a", "    b", "    c"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["    a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["    b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["    c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, []);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logSection("d");
            chai_1.assert.deepEqual(logger.allLogs, ["    a", "    b", "    c", "    d"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["    a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["    b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["    c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["    d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, []);
            indentedLogger.logVerbose("e");
            chai_1.assert.deepEqual(logger.allLogs, ["    a", "    b", "    c", "    d", "    e"]);
            chai_1.assert.deepEqual(logger.infoLogs, ["    a"]);
            chai_1.assert.deepEqual(logger.errorLogs, ["    b"]);
            chai_1.assert.deepEqual(logger.warningLogs, ["    c"]);
            chai_1.assert.deepEqual(logger.sectionLogs, ["    d"]);
            chai_1.assert.deepEqual(logger.verboseLogs, ["    e"]);
        });
    });
});
//# sourceMappingURL=loggerTests.js.map