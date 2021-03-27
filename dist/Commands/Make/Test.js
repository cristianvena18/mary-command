"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeTest = void 0;
var file_1 = require("../../Common/file");
var FileExistException_1 = require("../../Exceptions/FileExistException");
var chalk = require("chalk");
var MakeTest = /** @class */ (function () {
    function MakeTest() {
        this.command = "make:test";
        this.describe = "Make an test";
    }
    MakeTest.prototype.builder = function (args) {
        return args
            .option("n", { alias: "name", describe: "Name of test", required: true })
            .option("t", {
            alias: "type",
            default: "feature",
            describe: "Type of test",
        });
    };
    MakeTest.prototype.handler = function (args) {
        var testName = args.name;
        var type = args.type;
        var actionFilePath = MakeTest.buildTestFilePath(testName, type);
        var actionClass = MakeTest.buildTestClass(testName, type);
        MakeTest.makeDirectory(actionFilePath);
        MakeTest.fileSystemPut(actionFilePath, actionClass);
        console.info(chalk.greenBright(" >>> Test " + actionFilePath + " was created"));
    };
    MakeTest.makeDirectory = function (filePath) {
        filePath = filePath.slice(0, filePath.lastIndexOf("/"));
        if (!file_1.default.isDirectory(filePath)) {
            file_1.default.makeDirectory(filePath);
        }
    };
    MakeTest.fileSystemPut = function (filePath, fileClass) {
        file_1.default.writeFile(filePath, fileClass);
    };
    MakeTest.buildTestFilePath = function (testName, type) {
        var path = file_1.default.getCurrentDirectoryBase() + "tests/" + (type === "feature" ? "Featured" : "Unit") + "/" + testName + "Test.ts";
        if (file_1.default.directoryExists(path)) {
            throw new FileExistException_1.default(path);
        }
        return path;
    };
    MakeTest.buildTestClass = function (action, type) {
        var stub;
        if (type === "feature") {
            stub = file_1.default.resource_path("/stubs/FeaturedTest.stub");
        }
        else {
            stub = file_1.default.resource_path("/stubs/UnitTest.stub");
        }
        var stubContent = file_1.default.readFile(stub);
        stubContent = stubContent.replace(/{{action}}/gi, action);
        return stubContent;
    };
    return MakeTest;
}());
exports.MakeTest = MakeTest;
//# sourceMappingURL=Test.js.map