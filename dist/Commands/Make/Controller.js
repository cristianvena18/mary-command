"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeController = void 0;
var file_1 = require("../../Common/file");
var FileExistException_1 = require("../../Exceptions/FileExistException");
var GetConfig_1 = require("../../Common/Helpers/GetConfig");
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
        console.info(" >>> File " + actionFilePath + " was created");
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
    return MakeController;
}());
exports.MakeController = MakeController;
//# sourceMappingURL=Controller.js.map