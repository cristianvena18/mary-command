"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeController = void 0;
var file_1 = require("../../Common/file");
var FileExistException_1 = require("../../Exceptions/FileExistException");
var GetConfig_1 = require("../../Common/Helpers/GetConfig");
var chalk = require("chalk");
var MakeController = /** @class */ (function () {
    function MakeController() {
        this.command = "make:controller";
    }
    MakeController.prototype.builder = function (args) {
        return args.option("n", {
            alias: "name",
            required: true,
            describe: "Name of controller",
        });
    };
    MakeController.prototype.handler = function (args) {
        var controllerName = args.name;
        var config = GetConfig_1.getConfig();
        var actionFilePath = MakeController.buildActionFilePath(controllerName, config);
        var actionClass = MakeController.buildActionClass(controllerName);
        MakeController.makeDirectory(actionFilePath);
        MakeController.fileSystemPut(actionFilePath, actionClass);
        console.info(chalk.greenBright(" >>> File " + actionFilePath + " was created"));
        MakeController.bindFile(actionFilePath, controllerName + "Controller", config);
        console.info(chalk.greenBright(" >>> File " + actionFilePath + " was binding"));
    };
    MakeController.buildActionFilePath = function (controllerName, config) {
        var path = "" + file_1.default.getCurrentDirectoryBase() + config.controllerPath + controllerName + "Controller.ts";
        if (file_1.default.directoryExists(path)) {
            throw new FileExistException_1.default(path);
        }
        return path;
    };
    MakeController.buildActionClass = function (action) {
        var stub = file_1.default.resource_path("/stubs/Controller.stub");
        var stubContent = file_1.default.readFile(stub);
        stubContent = stubContent.replace(/{{action}}/gi, action);
        return stubContent;
    };
    MakeController.makeDirectory = function (filePath) {
        filePath = filePath.slice(0, filePath.lastIndexOf("/"));
        if (!file_1.default.isDirectory(filePath)) {
            file_1.default.makeDirectory(filePath);
        }
    };
    MakeController.fileSystemPut = function (filePath, fileClass) {
        file_1.default.writeFile(filePath, fileClass);
    };
    MakeController.bindFile = function (filePath, fileName, config) {
        var diPath = config.diPath;
        var diPathSpliced = diPath.split("/").reverse();
        diPathSpliced = diPathSpliced.slice(1);
        var importOut = "";
        for (var _i = 0, diPathSpliced_1 = diPathSpliced; _i < diPathSpliced_1.length; _i++) {
            var a = diPathSpliced_1[_i];
            if (a !== "src") {
                importOut += "../";
            }
        }
        filePath = filePath.replace("" + file_1.default.getCurrentDirectoryBase(), "");
        filePath = filePath.slice(4);
        var diContent = file_1.default
            .readFile("" + file_1.default.getCurrentDirectoryBase() + diPath)
            .split(/\n/);
        var newDiContent = [
            "import " + fileName + " from '" + (importOut + filePath.replace(".ts", "")) + "';",
        ];
        var containerContent = [];
        for (var _a = 0, diContent_1 = diContent; _a < diContent_1.length; _a++) {
            var content = diContent_1[_a];
            if (content.includes("import")) {
                newDiContent.push(content);
            }
            else {
                containerContent.push(content);
            }
        }
        for (var _b = 0, containerContent_1 = containerContent; _b < containerContent_1.length; _b++) {
            var content = containerContent_1[_b];
            if (content.includes("//Actions")) {
                newDiContent.push(content);
                newDiContent.push("DIContainer.bind(" + fileName + ").toSelf();");
                continue;
            }
            newDiContent.push(content);
        }
        file_1.default.writeFile(diPath, newDiContent);
    };
    return MakeController;
}());
exports.MakeController = MakeController;
//# sourceMappingURL=Controller.js.map