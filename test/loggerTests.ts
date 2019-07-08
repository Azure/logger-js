import { assert } from "chai";

import { getAzureDevOpsLogger, getCompositeLogger, getConsoleLogger, getInMemoryLogger, InMemoryLogger, Logger, prefix, wrapLogger, indent, timestamps, lineNumbers, splitLines } from "../lib/logger";

describe("logger.ts", function () {
  describe("getCompositeLogger()", function () {
    it("with no arguments", function () {
      const logger: Logger = getCompositeLogger();
      assert(logger);
    });

    it("with no defined arguments", function () {
      const logger: Logger = getCompositeLogger(undefined, undefined);
      assert(logger);
    });

    it("with one defined argument", function () {
      const inMemoryLogger: InMemoryLogger = getInMemoryLogger();
      const logger: Logger = getCompositeLogger(undefined, undefined, inMemoryLogger);
      assert.strictEqual(logger, inMemoryLogger);
    });

    it("logInfo()", async function () {
      const logger1: InMemoryLogger = getInMemoryLogger();
      const logger2: InMemoryLogger = getInMemoryLogger();
      const logger3: InMemoryLogger = getInMemoryLogger({ logInfo: false });
      const logger: Logger = getCompositeLogger(logger1, logger2, logger3);
      await logger.logInfo("test info");
      assert.deepEqual(logger1.allLogs, ["test info"]);
      assert.deepEqual(logger1.infoLogs, ["test info"]);
      assert.deepEqual(logger2.allLogs, ["test info"]);
      assert.deepEqual(logger2.infoLogs, ["test info"]);
      assert.deepEqual(logger3.allLogs, []);
      assert.deepEqual(logger3.infoLogs, []);
    });

    it("logError()", async function () {
      const logger1: InMemoryLogger = getInMemoryLogger();
      const logger2: InMemoryLogger = getInMemoryLogger();
      const logger3: InMemoryLogger = getInMemoryLogger({ logError: false });
      const logger: Logger = getCompositeLogger(logger1, logger2, logger3);
      await logger.logError("test error");
      assert.deepEqual(logger1.allLogs, ["test error"]);
      assert.deepEqual(logger1.errorLogs, ["test error"]);
      assert.deepEqual(logger2.allLogs, ["test error"]);
      assert.deepEqual(logger2.errorLogs, ["test error"]);
      assert.deepEqual(logger3.allLogs, []);
      assert.deepEqual(logger3.errorLogs, []);
    });

    it("logSection()", async function () {
      const logger1: InMemoryLogger = getInMemoryLogger();
      const logger2: InMemoryLogger = getInMemoryLogger();
      const logger3: InMemoryLogger = getInMemoryLogger({ logSection: false });
      const logger: Logger = getCompositeLogger(logger1, logger2, logger3);
      await logger.logSection("test section");
      assert.deepEqual(logger1.allLogs, ["test section"]);
      assert.deepEqual(logger1.sectionLogs, ["test section"]);
      assert.deepEqual(logger2.allLogs, ["test section"]);
      assert.deepEqual(logger2.sectionLogs, ["test section"]);
      assert.deepEqual(logger3.allLogs, []);
      assert.deepEqual(logger3.sectionLogs, []);
    });

    it("logVerbose()", async function () {
      const logger1: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const logger2: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const logger3: InMemoryLogger = getInMemoryLogger({ logVerbose: false });
      const logger: Logger = getCompositeLogger(logger1, logger2, logger3);
      await logger.logVerbose("test verbose");
      assert.deepEqual(logger1.allLogs, ["test verbose"]);
      assert.deepEqual(logger1.verboseLogs, ["test verbose"]);
      assert.deepEqual(logger2.allLogs, ["test verbose"]);
      assert.deepEqual(logger2.verboseLogs, ["test verbose"]);
      assert.deepEqual(logger3.allLogs, []);
      assert.deepEqual(logger3.verboseLogs, []);
    });

    it("logWarning()", async function () {
      const logger1: InMemoryLogger = getInMemoryLogger();
      const logger2: InMemoryLogger = getInMemoryLogger();
      const logger3: InMemoryLogger = getInMemoryLogger({ logWarning: false });
      const logger: Logger = getCompositeLogger(logger1, logger2, logger3);
      await logger.logWarning("test warning");
      assert.deepEqual(logger1.allLogs, ["test warning"]);
      assert.deepEqual(logger1.warningLogs, ["test warning"]);
      assert.deepEqual(logger2.allLogs, ["test warning"]);
      assert.deepEqual(logger2.warningLogs, ["test warning"]);
      assert.deepEqual(logger3.allLogs, []);
      assert.deepEqual(logger3.warningLogs, []);
    });
  });

  it("getConsoleLogger()", function () {
    const logger: Logger = getConsoleLogger();
    assert(logger);
    assert(logger.logError);
    assert(logger.logInfo);
    assert(logger.logSection);
    assert(logger.logVerbose);
    assert(logger.logWarning);
  });

  describe("getAzureDevopsLogger()", function () {
    it("with no options", function () {
      const logger: Logger = getAzureDevOpsLogger();
      assert(logger);
      assert(logger.logError);
      assert(logger.logInfo);
      assert(logger.logSection);
      assert(logger.logVerbose);
      assert(logger.logWarning);
    });

    it("with empty options", function () {
      const logger: Logger = getAzureDevOpsLogger({});
      assert(logger);
      assert(logger.logError);
      assert(logger.logInfo);
      assert(logger.logSection);
      assert(logger.logVerbose);
      assert(logger.logWarning);
    });

    it("with toWrap logger", async function () {
      const inMemoryLogger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const logger: Logger = getAzureDevOpsLogger({ toWrap: inMemoryLogger });

      await logger.logError("a");
      assert.deepEqual(inMemoryLogger.allLogs, ["##[error]a"]);
      assert.deepEqual(inMemoryLogger.errorLogs, ["##[error]a"]);
      assert.deepEqual(inMemoryLogger.infoLogs, []);
      assert.deepEqual(inMemoryLogger.sectionLogs, []);
      assert.deepEqual(inMemoryLogger.warningLogs, []);
      assert.deepEqual(inMemoryLogger.verboseLogs, []);

      await logger.logInfo("b");
      assert.deepEqual(inMemoryLogger.allLogs, ["##[error]a", "b"]);
      assert.deepEqual(inMemoryLogger.errorLogs, ["##[error]a"]);
      assert.deepEqual(inMemoryLogger.infoLogs, ["b"]);
      assert.deepEqual(inMemoryLogger.sectionLogs, []);
      assert.deepEqual(inMemoryLogger.warningLogs, []);
      assert.deepEqual(inMemoryLogger.verboseLogs, []);

      await logger.logSection("c");
      assert.deepEqual(inMemoryLogger.allLogs, ["##[error]a", "b", "##[section]c"]);
      assert.deepEqual(inMemoryLogger.errorLogs, ["##[error]a"]);
      assert.deepEqual(inMemoryLogger.infoLogs, ["b"]);
      assert.deepEqual(inMemoryLogger.sectionLogs, ["##[section]c"]);
      assert.deepEqual(inMemoryLogger.warningLogs, []);
      assert.deepEqual(inMemoryLogger.verboseLogs, []);

      await logger.logWarning("d");
      assert.deepEqual(inMemoryLogger.allLogs, ["##[error]a", "b", "##[section]c", "##[warning]d"]);
      assert.deepEqual(inMemoryLogger.errorLogs, ["##[error]a"]);
      assert.deepEqual(inMemoryLogger.infoLogs, ["b"]);
      assert.deepEqual(inMemoryLogger.sectionLogs, ["##[section]c"]);
      assert.deepEqual(inMemoryLogger.warningLogs, ["##[warning]d"]);
      assert.deepEqual(inMemoryLogger.verboseLogs, []);

      await logger.logVerbose("e");
      assert.deepEqual(inMemoryLogger.allLogs, ["##[error]a", "b", "##[section]c", "##[warning]d", "e"]);
      assert.deepEqual(inMemoryLogger.errorLogs, ["##[error]a"]);
      assert.deepEqual(inMemoryLogger.infoLogs, ["b"]);
      assert.deepEqual(inMemoryLogger.sectionLogs, ["##[section]c"]);
      assert.deepEqual(inMemoryLogger.warningLogs, ["##[warning]d"]);
      assert.deepEqual(inMemoryLogger.verboseLogs, ["e"]);
    });
  });

  describe("InMemoryLogger", function () {
    it("getInMemoryLogger()", function () {
      const logger: InMemoryLogger = getInMemoryLogger();
      assert.deepEqual(logger.allLogs, []);
      assert.deepEqual(logger.infoLogs, []);
      assert.deepEqual(logger.errorLogs, []);
    });

    it("logInfo()", async function () {
      const logger: InMemoryLogger = getInMemoryLogger();
      await logger.logInfo("apples");
      assert.deepEqual(logger.allLogs, ["apples"]);
      assert.deepEqual(logger.infoLogs, ["apples"]);
      assert.deepEqual(logger.errorLogs, []);

      await logger.logInfo("");
      assert.deepEqual(logger.allLogs, ["apples", ""]);
      assert.deepEqual(logger.infoLogs, ["apples", ""]);
      assert.deepEqual(logger.errorLogs, []);
    });

    it("logError()", async function () {
      const logger: InMemoryLogger = getInMemoryLogger();
      await logger.logError("bananas");
      assert.deepEqual(logger.allLogs, ["bananas"]);
      assert.deepEqual(logger.infoLogs, []);
      assert.deepEqual(logger.errorLogs, ["bananas"]);

      await logger.logError("");
      assert.deepEqual(logger.allLogs, ["bananas", ""]);
      assert.deepEqual(logger.infoLogs, []);
      assert.deepEqual(logger.errorLogs, ["bananas", ""]);
    });
  });

  describe("wrapLogger()", function () {
    it("with overridden logInfo()", async function () {
      const logger: InMemoryLogger = getInMemoryLogger();
      const wrappedLogger: Logger = wrapLogger(logger, {
        logInfo: (text: string) => logger.logInfo(`[INFO] ${text}`)
      });

      await wrappedLogger.logInfo("abc");
      assert.deepEqual(logger.allLogs, ["[INFO] abc"]);
      assert.deepEqual(logger.infoLogs, ["[INFO] abc"]);
      assert.deepEqual(logger.errorLogs, []);

      await wrappedLogger.logError("xyz");
      assert.deepEqual(logger.allLogs, ["[INFO] abc", "xyz"]);
      assert.deepEqual(logger.infoLogs, ["[INFO] abc"]);
      assert.deepEqual(logger.errorLogs, ["xyz"]);
    });

    it("with overridden logError()", async function () {
      const logger: InMemoryLogger = getInMemoryLogger();
      const wrappedLogger: Logger = wrapLogger(logger, {
        logError: (text: string) => logger.logError(`[ERROR] ${text}`)
      });

      await wrappedLogger.logInfo("abc");
      assert.deepEqual(logger.allLogs, ["abc"]);
      assert.deepEqual(logger.infoLogs, ["abc"]);
      assert.deepEqual(logger.errorLogs, []);

      await wrappedLogger.logError("xyz");
      assert.deepEqual(logger.allLogs, ["abc", "[ERROR] xyz"]);
      assert.deepEqual(logger.infoLogs, ["abc"]);
      assert.deepEqual(logger.errorLogs, ["[ERROR] xyz"]);
    });
  });

  describe("prefix()", function () {
    it("with empty string", function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const prefixLogger: Logger = prefix(logger, "");

      prefixLogger.logInfo("a");
      assert.deepEqual(logger.allLogs, ["a"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logError("b");
      assert.deepEqual(logger.allLogs, ["a", "b"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logWarning("c");
      assert.deepEqual(logger.allLogs, ["a", "b", "c"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, ["c"]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logSection("d");
      assert.deepEqual(logger.allLogs, ["a", "b", "c", "d"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, ["c"]);
      assert.deepEqual(logger.sectionLogs, ["d"]);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logVerbose("e");
      assert.deepEqual(logger.allLogs, ["a", "b", "c", "d", "e"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, ["c"]);
      assert.deepEqual(logger.sectionLogs, ["d"]);
      assert.deepEqual(logger.verboseLogs, ["e"]);
    });

    it("with non-empty string", function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const prefixLogger: Logger = prefix(logger, "  ");

      prefixLogger.logInfo("a");
      assert.deepEqual(logger.allLogs, ["  a"]);
      assert.deepEqual(logger.infoLogs, ["  a"]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logError("b");
      assert.deepEqual(logger.allLogs, ["  a", "  b"]);
      assert.deepEqual(logger.infoLogs, ["  a"]);
      assert.deepEqual(logger.errorLogs, ["  b"]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logWarning("c");
      assert.deepEqual(logger.allLogs, ["  a", "  b", "  c"]);
      assert.deepEqual(logger.infoLogs, ["  a"]);
      assert.deepEqual(logger.errorLogs, ["  b"]);
      assert.deepEqual(logger.warningLogs, ["  c"]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logSection("d");
      assert.deepEqual(logger.allLogs, ["  a", "  b", "  c", "  d"]);
      assert.deepEqual(logger.infoLogs, ["  a"]);
      assert.deepEqual(logger.errorLogs, ["  b"]);
      assert.deepEqual(logger.warningLogs, ["  c"]);
      assert.deepEqual(logger.sectionLogs, ["  d"]);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logVerbose("e");
      assert.deepEqual(logger.allLogs, ["  a", "  b", "  c", "  d", "  e"]);
      assert.deepEqual(logger.infoLogs, ["  a"]);
      assert.deepEqual(logger.errorLogs, ["  b"]);
      assert.deepEqual(logger.warningLogs, ["  c"]);
      assert.deepEqual(logger.sectionLogs, ["  d"]);
      assert.deepEqual(logger.verboseLogs, ["  e"]);
    });

    it("with function", function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      let logCount = 0;
      const prefixLogger: Logger = prefix(logger, () => `${++logCount}. `);

      prefixLogger.logInfo("a");
      assert.deepEqual(logger.allLogs, ["1. a"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logError("b");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logWarning("c");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, ["3. c"]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logSection("d");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c", "4. d"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, ["3. c"]);
      assert.deepEqual(logger.sectionLogs, ["4. d"]);
      assert.deepEqual(logger.verboseLogs, []);

      prefixLogger.logVerbose("e");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c", "4. d", "5. e"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, ["3. c"]);
      assert.deepEqual(logger.sectionLogs, ["4. d"]);
      assert.deepEqual(logger.verboseLogs, ["5. e"]);
    });
  });

  describe("indent()", function () {
    it("with empty string", function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const indentedLogger: Logger = indent(logger, "");

      indentedLogger.logInfo("a");
      assert.deepEqual(logger.allLogs, ["a"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logError("b");
      assert.deepEqual(logger.allLogs, ["a", "b"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logWarning("c");
      assert.deepEqual(logger.allLogs, ["a", "b", "c"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, ["c"]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logSection("d");
      assert.deepEqual(logger.allLogs, ["a", "b", "c", "d"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, ["c"]);
      assert.deepEqual(logger.sectionLogs, ["d"]);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logVerbose("e");
      assert.deepEqual(logger.allLogs, ["a", "b", "c", "d", "e"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, ["c"]);
      assert.deepEqual(logger.sectionLogs, ["d"]);
      assert.deepEqual(logger.verboseLogs, ["e"]);
    });

    it("with non-empty string", function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const indentedLogger: Logger = indent(logger, "  ");

      indentedLogger.logInfo("a");
      assert.deepEqual(logger.allLogs, ["  a"]);
      assert.deepEqual(logger.infoLogs, ["  a"]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logError("b");
      assert.deepEqual(logger.allLogs, ["  a", "  b"]);
      assert.deepEqual(logger.infoLogs, ["  a"]);
      assert.deepEqual(logger.errorLogs, ["  b"]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logWarning("c");
      assert.deepEqual(logger.allLogs, ["  a", "  b", "  c"]);
      assert.deepEqual(logger.infoLogs, ["  a"]);
      assert.deepEqual(logger.errorLogs, ["  b"]);
      assert.deepEqual(logger.warningLogs, ["  c"]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logSection("d");
      assert.deepEqual(logger.allLogs, ["  a", "  b", "  c", "  d"]);
      assert.deepEqual(logger.infoLogs, ["  a"]);
      assert.deepEqual(logger.errorLogs, ["  b"]);
      assert.deepEqual(logger.warningLogs, ["  c"]);
      assert.deepEqual(logger.sectionLogs, ["  d"]);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logVerbose("e");
      assert.deepEqual(logger.allLogs, ["  a", "  b", "  c", "  d", "  e"]);
      assert.deepEqual(logger.infoLogs, ["  a"]);
      assert.deepEqual(logger.errorLogs, ["  b"]);
      assert.deepEqual(logger.warningLogs, ["  c"]);
      assert.deepEqual(logger.sectionLogs, ["  d"]);
      assert.deepEqual(logger.verboseLogs, ["  e"]);
    });

    it("with number", function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const indentedLogger: Logger = indent(logger, 4);

      indentedLogger.logInfo("a");
      assert.deepEqual(logger.allLogs, ["    a"]);
      assert.deepEqual(logger.infoLogs, ["    a"]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logError("b");
      assert.deepEqual(logger.allLogs, ["    a", "    b"]);
      assert.deepEqual(logger.infoLogs, ["    a"]);
      assert.deepEqual(logger.errorLogs, ["    b"]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logWarning("c");
      assert.deepEqual(logger.allLogs, ["    a", "    b", "    c"]);
      assert.deepEqual(logger.infoLogs, ["    a"]);
      assert.deepEqual(logger.errorLogs, ["    b"]);
      assert.deepEqual(logger.warningLogs, ["    c"]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logSection("d");
      assert.deepEqual(logger.allLogs, ["    a", "    b", "    c", "    d"]);
      assert.deepEqual(logger.infoLogs, ["    a"]);
      assert.deepEqual(logger.errorLogs, ["    b"]);
      assert.deepEqual(logger.warningLogs, ["    c"]);
      assert.deepEqual(logger.sectionLogs, ["    d"]);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logVerbose("e");
      assert.deepEqual(logger.allLogs, ["    a", "    b", "    c", "    d", "    e"]);
      assert.deepEqual(logger.infoLogs, ["    a"]);
      assert.deepEqual(logger.errorLogs, ["    b"]);
      assert.deepEqual(logger.warningLogs, ["    c"]);
      assert.deepEqual(logger.sectionLogs, ["    d"]);
      assert.deepEqual(logger.verboseLogs, ["    e"]);
    });
  });

  it("timestamps()", function () {
    const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
    const timestampLogger: Logger = timestamps(logger);

    timestampLogger.logError("a");
    assert.strictEqual(logger.allLogs.length, 1);
    assert(logger.allLogs[0].endsWith(": a"));
    assert.deepEqual(logger.infoLogs, []);
    assert.strictEqual(logger.errorLogs.length, 1);
    assert(logger.errorLogs[0].endsWith(": a"));
    assert.deepEqual(logger.warningLogs, []);
    assert.deepEqual(logger.sectionLogs, []);
    assert.deepEqual(logger.verboseLogs, []);

    timestampLogger.logInfo("b");
    assert.strictEqual(logger.allLogs.length, 2);
    assert(logger.allLogs[0].endsWith(": a"));
    assert(logger.allLogs[1].endsWith(": b"));
    assert.strictEqual(logger.infoLogs.length, 1);
    assert(logger.infoLogs[0].endsWith(": b"));
    assert.strictEqual(logger.errorLogs.length, 1);
    assert(logger.errorLogs[0].endsWith(": a"));
    assert.deepEqual(logger.warningLogs, []);
    assert.deepEqual(logger.sectionLogs, []);
    assert.deepEqual(logger.verboseLogs, []);

    timestampLogger.logWarning("c");
    assert.strictEqual(logger.allLogs.length, 3);
    assert(logger.allLogs[0].endsWith(": a"));
    assert(logger.allLogs[1].endsWith(": b"));
    assert(logger.allLogs[2].endsWith(": c"));
    assert.strictEqual(logger.infoLogs.length, 1);
    assert(logger.infoLogs[0].endsWith(": b"));
    assert.strictEqual(logger.errorLogs.length, 1);
    assert(logger.errorLogs[0].endsWith(": a"));
    assert.strictEqual(logger.warningLogs.length, 1);
    assert(logger.warningLogs[0].endsWith(": c"));
    assert.deepEqual(logger.sectionLogs, []);
    assert.deepEqual(logger.verboseLogs, []);

    timestampLogger.logSection("d");
    assert.strictEqual(logger.allLogs.length, 4);
    assert(logger.allLogs[0].endsWith(": a"));
    assert(logger.allLogs[1].endsWith(": b"));
    assert(logger.allLogs[2].endsWith(": c"));
    assert(logger.allLogs[3].endsWith(": d"));
    assert.strictEqual(logger.infoLogs.length, 1);
    assert(logger.infoLogs[0].endsWith(": b"));
    assert.strictEqual(logger.errorLogs.length, 1);
    assert(logger.errorLogs[0].endsWith(": a"));
    assert.strictEqual(logger.warningLogs.length, 1);
    assert(logger.warningLogs[0].endsWith(": c"));
    assert.strictEqual(logger.sectionLogs.length, 1);
    assert(logger.sectionLogs[0].endsWith(": d"));
    assert.deepEqual(logger.verboseLogs, []);

    timestampLogger.logVerbose("e");
    assert.strictEqual(logger.allLogs.length, 5);
    assert(logger.allLogs[0].endsWith(": a"));
    assert(logger.allLogs[1].endsWith(": b"));
    assert(logger.allLogs[2].endsWith(": c"));
    assert(logger.allLogs[3].endsWith(": d"));
    assert(logger.allLogs[4].endsWith(": e"));
    assert.strictEqual(logger.infoLogs.length, 1);
    assert(logger.infoLogs[0].endsWith(": b"));
    assert.strictEqual(logger.errorLogs.length, 1);
    assert(logger.errorLogs[0].endsWith(": a"));
    assert.strictEqual(logger.warningLogs.length, 1);
    assert(logger.warningLogs[0].endsWith(": c"));
    assert.strictEqual(logger.sectionLogs.length, 1);
    assert(logger.sectionLogs[0].endsWith(": d"));
    assert.strictEqual(logger.verboseLogs.length, 1);
    assert(logger.verboseLogs[0].endsWith(": e"));
  });

  describe("lineNumbers()", function () {
    it("with no firstLineNumber argument", function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const indentedLogger: Logger = lineNumbers(logger);

      indentedLogger.logInfo("a");
      assert.deepEqual(logger.allLogs, ["1. a"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logError("b");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logWarning("c");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, ["3. c"]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logSection("d");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c", "4. d"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, ["3. c"]);
      assert.deepEqual(logger.sectionLogs, ["4. d"]);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logVerbose("e");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c", "4. d", "5. e"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, ["3. c"]);
      assert.deepEqual(logger.sectionLogs, ["4. d"]);
      assert.deepEqual(logger.verboseLogs, ["5. e"]);
    });

    it("with undefined firstLineNumber", function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const indentedLogger: Logger = lineNumbers(logger, undefined);

      indentedLogger.logInfo("a");
      assert.deepEqual(logger.allLogs, ["1. a"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logError("b");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logWarning("c");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, ["3. c"]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logSection("d");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c", "4. d"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, ["3. c"]);
      assert.deepEqual(logger.sectionLogs, ["4. d"]);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logVerbose("e");
      assert.deepEqual(logger.allLogs, ["1. a", "2. b", "3. c", "4. d", "5. e"]);
      assert.deepEqual(logger.infoLogs, ["1. a"]);
      assert.deepEqual(logger.errorLogs, ["2. b"]);
      assert.deepEqual(logger.warningLogs, ["3. c"]);
      assert.deepEqual(logger.sectionLogs, ["4. d"]);
      assert.deepEqual(logger.verboseLogs, ["5. e"]);
    });

    it("with 0 firstLineNumber", function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const indentedLogger: Logger = lineNumbers(logger, 0);

      indentedLogger.logInfo("a");
      assert.deepEqual(logger.allLogs, ["0. a"]);
      assert.deepEqual(logger.infoLogs, ["0. a"]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logError("b");
      assert.deepEqual(logger.allLogs, ["0. a", "1. b"]);
      assert.deepEqual(logger.infoLogs, ["0. a"]);
      assert.deepEqual(logger.errorLogs, ["1. b"]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logWarning("c");
      assert.deepEqual(logger.allLogs, ["0. a", "1. b", "2. c"]);
      assert.deepEqual(logger.infoLogs, ["0. a"]);
      assert.deepEqual(logger.errorLogs, ["1. b"]);
      assert.deepEqual(logger.warningLogs, ["2. c"]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logSection("d");
      assert.deepEqual(logger.allLogs, ["0. a", "1. b", "2. c", "3. d"]);
      assert.deepEqual(logger.infoLogs, ["0. a"]);
      assert.deepEqual(logger.errorLogs, ["1. b"]);
      assert.deepEqual(logger.warningLogs, ["2. c"]);
      assert.deepEqual(logger.sectionLogs, ["3. d"]);
      assert.deepEqual(logger.verboseLogs, []);

      indentedLogger.logVerbose("e");
      assert.deepEqual(logger.allLogs, ["0. a", "1. b", "2. c", "3. d", "4. e"]);
      assert.deepEqual(logger.infoLogs, ["0. a"]);
      assert.deepEqual(logger.errorLogs, ["1. b"]);
      assert.deepEqual(logger.warningLogs, ["2. c"]);
      assert.deepEqual(logger.sectionLogs, ["3. d"]);
      assert.deepEqual(logger.verboseLogs, ["4. e"]);
    });
  });

  describe("splitLines()", function () {
    it("with undefined text", async function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const splitLogger: Logger = splitLines(logger);

      await splitLogger.logInfo(undefined as any);
      assert.deepEqual(logger.allLogs, []);
      assert.deepEqual(logger.infoLogs, []);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logError(undefined as any);
      assert.deepEqual(logger.allLogs, []);
      assert.deepEqual(logger.infoLogs, []);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logWarning(undefined as any);
      assert.deepEqual(logger.allLogs, []);
      assert.deepEqual(logger.infoLogs, []);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logSection(undefined as any);
      assert.deepEqual(logger.allLogs, []);
      assert.deepEqual(logger.infoLogs, []);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logVerbose(undefined as any);
      assert.deepEqual(logger.allLogs, []);
      assert.deepEqual(logger.infoLogs, []);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);
    });

    it("with empty text", async function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const splitLogger: Logger = splitLines(logger);

      await splitLogger.logInfo("");
      assert.deepEqual(logger.allLogs, [""]);
      assert.deepEqual(logger.infoLogs, [""]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logError("");
      assert.deepEqual(logger.allLogs, ["", ""]);
      assert.deepEqual(logger.infoLogs, [""]);
      assert.deepEqual(logger.errorLogs, [""]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logWarning("");
      assert.deepEqual(logger.allLogs, ["", "", ""]);
      assert.deepEqual(logger.infoLogs, [""]);
      assert.deepEqual(logger.errorLogs, [""]);
      assert.deepEqual(logger.warningLogs, [""]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logSection("");
      assert.deepEqual(logger.allLogs, ["", "", "", ""]);
      assert.deepEqual(logger.infoLogs, [""]);
      assert.deepEqual(logger.errorLogs, [""]);
      assert.deepEqual(logger.warningLogs, [""]);
      assert.deepEqual(logger.sectionLogs, [""]);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logVerbose("");
      assert.deepEqual(logger.allLogs, ["", "", "", "", ""]);
      assert.deepEqual(logger.infoLogs, [""]);
      assert.deepEqual(logger.errorLogs, [""]);
      assert.deepEqual(logger.warningLogs, [""]);
      assert.deepEqual(logger.sectionLogs, [""]);
      assert.deepEqual(logger.verboseLogs, [""]);
    });

    it("with single-line text", async function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const splitLogger: Logger = splitLines(logger);

      await splitLogger.logInfo("a");
      assert.deepEqual(logger.allLogs, ["a"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logError("b");
      assert.deepEqual(logger.allLogs, ["a", "b"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logWarning("c");
      assert.deepEqual(logger.allLogs, ["a", "b", "c"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, ["c"]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logSection("d");
      assert.deepEqual(logger.allLogs, ["a", "b", "c", "d"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, ["c"]);
      assert.deepEqual(logger.sectionLogs, ["d"]);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logVerbose("e");
      assert.deepEqual(logger.allLogs, ["a", "b", "c", "d", "e"]);
      assert.deepEqual(logger.infoLogs, ["a"]);
      assert.deepEqual(logger.errorLogs, ["b"]);
      assert.deepEqual(logger.warningLogs, ["c"]);
      assert.deepEqual(logger.sectionLogs, ["d"]);
      assert.deepEqual(logger.verboseLogs, ["e"]);
    });

    it("with multi-line text", async function () {
      const logger: InMemoryLogger = getInMemoryLogger({ logVerbose: true });
      const splitLogger: Logger = splitLines(logger);

      await splitLogger.logInfo("\na");
      assert.deepEqual(logger.allLogs, ["", "a"]);
      assert.deepEqual(logger.infoLogs, ["", "a"]);
      assert.deepEqual(logger.errorLogs, []);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logError("b\n");
      assert.deepEqual(logger.allLogs, ["", "a", "b", ""]);
      assert.deepEqual(logger.infoLogs, ["", "a"]);
      assert.deepEqual(logger.errorLogs, ["b", ""]);
      assert.deepEqual(logger.warningLogs, []);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logWarning("c\nd");
      assert.deepEqual(logger.allLogs, ["", "a", "b", "", "c", "d"]);
      assert.deepEqual(logger.infoLogs, ["", "a"]);
      assert.deepEqual(logger.errorLogs, ["b", ""]);
      assert.deepEqual(logger.warningLogs, ["c", "d"]);
      assert.deepEqual(logger.sectionLogs, []);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logSection("\ne\n");
      assert.deepEqual(logger.allLogs, ["", "a", "b", "", "c", "d", "", "e", ""]);
      assert.deepEqual(logger.infoLogs, ["", "a"]);
      assert.deepEqual(logger.errorLogs, ["b", ""]);
      assert.deepEqual(logger.warningLogs, ["c", "d"]);
      assert.deepEqual(logger.sectionLogs, ["", "e", ""]);
      assert.deepEqual(logger.verboseLogs, []);

      await splitLogger.logVerbose("f\ngh\nijklmn\n\nop");
      assert.deepEqual(logger.allLogs, ["", "a", "b", "", "c", "d", "", "e", "", "f", "gh", "ijklmn", "", "op"]);
      assert.deepEqual(logger.infoLogs, ["", "a"]);
      assert.deepEqual(logger.errorLogs, ["b", ""]);
      assert.deepEqual(logger.warningLogs, ["c", "d"]);
      assert.deepEqual(logger.sectionLogs, ["", "e", ""]);
      assert.deepEqual(logger.verboseLogs, ["f", "gh", "ijklmn", "", "op"]);
    });
  });
});
