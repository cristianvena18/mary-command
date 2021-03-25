"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeRepository = void 0;
var file_1 = require("../../Common/file");
var FileExistException_1 = require("../../Exceptions/FileExistException");
var GetConfig_1 = require("../../Common/Helpers/GetConfig");
var MakeRepository = /** @class */ (function () {
    function MakeRepository() {
        this.command = "make:repository";
        this.describe = "Creates a repository by a entity";
    }
    MakeRepository.prototype.builder = function (args) {
        return args.option("n", {
            alias: "name",
            describe: "Name of repository",
            required: true,
        });
    };
    MakeRepository.prototype.handler = function (args) {
        var repositoryName = args.name;
        var config = GetConfig_1.getConfig();
        var interfaceFilePath;
        var interfaceClass;
        if (config.shouldCreateRepositoryInterface) {
            interfaceFilePath = MakeRepository.buildInterfaceFilePath(repositoryName, config);
            interfaceClass = MakeRepository.buildInterfaceClass(repositoryName);
            MakeRepository.makeDirectory(interfaceFilePath);
            MakeRepository.fileSystemPut(interfaceFilePath, interfaceClass);
        }
        var actionFilePath = MakeRepository.buildImplementationFilePath(repositoryName, config);
        var actionClass = MakeRepository.buildActionClass(repositoryName, config);
        MakeRepository.makeDirectory(actionFilePath);
        MakeRepository.fileSystemPut(actionFilePath, actionClass);
        console.info(" >>> File " + actionFilePath + " was created");
        MakeRepository.bindFile(actionFilePath, "" + config.database + repositoryName + "Repository", interfaceFilePath, repositoryName + "Repository", config);
    };
    MakeRepository.makeDirectory = function (filePath) {
        filePath = filePath.slice(0, filePath.lastIndexOf("/"));
        if (!file_1.default.isDirectory(filePath)) {
            file_1.default.makeDirectory(filePath);
        }
    };
    MakeRepository.fileSystemPut = function (filePath, fileClass) {
        file_1.default.writeFile(filePath, fileClass);
    };
    MakeRepository.buildInterfaceFilePath = function (repositoryName, config) {
        if (!config.shouldCreateRepositoryInterface) {
            return;
        }
        var path = "" + file_1.default.getCurrentDirectoryBase() + config.repositoryInterfacePath + repositoryName + "Repository.ts";
        if (file_1.default.directoryExists(path)) {
            throw new FileExistException_1.default(path);
        }
        return path;
    };
    MakeRepository.buildImplementationFilePath = function (repositoryName, config) {
        var path = "" + file_1.default.getCurrentDirectoryBase() + config.repositoryPath + config.database + repositoryName + "Repository.ts";
        if (file_1.default.directoryExists(path)) {
            throw new FileExistException_1.default(path);
        }
        return path;
    };
    MakeRepository.buildInterfaceClass = function (name) {
        var stub = file_1.default.resource_path("/stubs/RepositoryInterface.stub");
        var stubContent = file_1.default.readFile(stub);
        stubContent = stubContent
            .replace(/{{name}}/gi, name.toLowerCase())
            .replace(/{{type}}/gi, name);
        return stubContent;
    };
    MakeRepository.buildActionClass = function (name, config) {
        var stub = file_1.default.resource_path("/stubs/Repository.stub");
        var stubContent = file_1.default.readFile(stub);
        var interfacePath = config.shouldCreateRepositoryInterface
            ? "import { " + name + "Repository } from '../../../Domain/Interfaces/Repositories/" + name + "Repository.ts'"
            : "";
        var _interface = config.shouldCreateRepositoryInterface
            ? "implements " + name + "Repository"
            : "";
        stubContent = stubContent
            .replace(/{{name}}/gi, name.toLowerCase())
            .replace(/{{type}}/gi, name)
            .replace(/{{interface_path}}/gi, interfacePath)
            .replace(/{{interface}}/gi, _interface)
            .replace(/{{database}}/gi, config.database);
        return stubContent;
    };
    MakeRepository.bindFile = function (filePath, fileName, interfacePath, interfaceName, config) {
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
        if (interfacePath) {
            interfacePath = interfacePath.replace("" + file_1.default.getCurrentDirectoryBase(), "");
            interfacePath = interfacePath.slice(4);
        }
        var diContent = file_1.default
            .readFile("" + file_1.default.getCurrentDirectoryBase() + diPath)
            .split(/\n/);
        if (interfacePath) {
            var interfacesContent = file_1.default
                .readFile("" + file_1.default.getCurrentDirectoryBase() + diPath.replace("di.config.ts", "interfaces.types.ts"))
                .split(/\n/);
            var newContent = [];
            for (var _a = 0, interfacesContent_1 = interfacesContent; _a < interfacesContent_1.length; _a++) {
                var content = interfacesContent_1[_a];
                if (content.includes("//Symbols")) {
                    newContent.push(content);
                    newContent.push(interfaceName + ": Symbol.for(\"" + interfaceName + "\"),");
                }
                else {
                    newContent.push(content);
                }
            }
            file_1.default.writeFile("" + file_1.default.getCurrentDirectoryBase() + diPath.replace("di.config.ts", "interfaces.types.ts"), newContent);
        }
        var newDiContent = [
            "import " + fileName + " from '" + (importOut + filePath.replace(".ts", "")) + "';",
        ];
        if (interfacePath) {
            newDiContent.push("import { " + interfaceName + " } from '" + (importOut + interfacePath.replace(".ts", "")) + "';");
        }
        var containerContent = [];
        for (var _b = 0, diContent_1 = diContent; _b < diContent_1.length; _b++) {
            var content = diContent_1[_b];
            if (content.includes("import")) {
                newDiContent.push(content);
            }
            else {
                containerContent.push(content);
            }
        }
        for (var _c = 0, containerContent_1 = containerContent; _c < containerContent_1.length; _c++) {
            var content = containerContent_1[_c];
            if (content.includes("//Repositories")) {
                newDiContent.push(content);
                if (interfacePath) {
                    newDiContent.push("DIContainer.bind<" + interfaceName + ">(INTERFACES." + interfaceName + ").to(" + fileName + ");");
                }
                else {
                    newDiContent.push("DIContainer.bind(" + fileName + ").toSelf();");
                }
                continue;
            }
            newDiContent.push(content);
        }
        file_1.default.writeFile(diPath, newDiContent);
    };
    return MakeRepository;
}());
exports.MakeRepository = MakeRepository;
//# sourceMappingURL=Repository.js.map