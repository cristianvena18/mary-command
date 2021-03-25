"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeUseCase = void 0;
var file_1 = require("../../Common/file");
var FileExistException_1 = require("../../Exceptions/FileExistException");
var GetConfig_1 = require("../../Common/Helpers/GetConfig");
var MakeUseCase = /** @class */ (function () {
    function MakeUseCase() {
        this.command = "make:usecase";
    }
    MakeUseCase.prototype.builder = function (args) {
        return args
            .option("n", {
            alias: "name",
            required: true,
            describe: "Name of use case",
        })
            .option("t", {
            alias: "type",
            default: "c",
            describe: "Type of use case query (q) or Command (c)",
        })
            .option("p", {
            alias: "parameters",
            required: true,
            describe: "Parameters to generate use case (id-number,name-string,email-Object)",
        })
            .option("g", {
            alias: "grouping",
            required: true,
            describe: "Group that the use case belongs to (/Grouping/Example)",
        });
    };
    MakeUseCase.prototype.handler = function (args) {
        var useCaseName = args.name;
        var useCaseType = args.type;
        var grouping = args.grouping;
        var attributes = args.parameters;
        var config = GetConfig_1.getConfig();
        if (config.type === 'default') {
            console.error('Not supported for your config!');
            process.exit(1);
        }
        var isCommand = useCaseType === "c";
        var actionFilePath = MakeUseCase.buildActionFilePath(useCaseName, grouping, config);
        var adapterFilePath = MakeUseCase.buildAdapterFilePath(useCaseName, grouping, config);
        var inputFilePath = MakeUseCase.buildInputFilePath(useCaseName, grouping, isCommand, config);
        var handlerFilePath = MakeUseCase.buildHandlerFilePath(useCaseName, grouping, isCommand, config);
        var resultFilePath = isCommand === false && config.shouldCreateQueryResult
            ? MakeUseCase.buildResultFilePath(useCaseName, grouping, config)
            : null;
        console.info("\n1. File paths was built!\n");
        var actionClass = MakeUseCase.buildActionClass(useCaseName, grouping, isCommand);
        var adapterClass = MakeUseCase.buildAdapterClass(useCaseName, grouping, isCommand);
        var inputClass = MakeUseCase.buildInputClass(useCaseName, grouping, attributes, isCommand);
        var handlerClass = MakeUseCase.buildHandlerClass(useCaseName, grouping, isCommand);
        var resultClass = isCommand === false
            ? MakeUseCase.buildResultClass(useCaseName, grouping)
            : null;
        console.info("2. Classes was built!\n");
        MakeUseCase.makeDirectory(actionFilePath);
        MakeUseCase.makeDirectory(adapterFilePath);
        MakeUseCase.makeDirectory(inputFilePath);
        MakeUseCase.makeDirectory(handlerFilePath);
        if (!isCommand) {
            MakeUseCase.makeDirectory(resultFilePath);
        }
        console.info("3. Directories was checked!\n");
        MakeUseCase.fileSystemPut(actionFilePath, actionClass);
        console.info(" >>> File " + actionFilePath + " was created");
        MakeUseCase.fileSystemPut(adapterFilePath, adapterClass);
        console.info(" >>> File " + adapterFilePath + " was created");
        MakeUseCase.fileSystemPut(inputFilePath, inputClass);
        console.info(" >>> File " + inputFilePath + " was created");
        MakeUseCase.fileSystemPut(handlerFilePath, handlerClass);
        console.info(" >>> File " + handlerFilePath + " was created");
        if (!isCommand) {
            MakeUseCase.fileSystemPut(resultFilePath, resultClass);
            console.info(" >>> File " + resultFilePath + " was created");
        }
        console.info("4. Files was created!\n");
        MakeUseCase.bindFile(actionFilePath, "" + useCaseName + grouping + "Action", config);
        MakeUseCase.bindFile(adapterFilePath, "" + useCaseName + grouping + "Adapter", config);
        MakeUseCase.bindFile(handlerFilePath, "" + useCaseName + grouping + "Handler", config);
        if (!isCommand && config.shouldCreateQueryResult) {
            MakeUseCase.bindFile(resultFilePath, "" + useCaseName + grouping + "Result", config);
        }
        console.info("5. Classes was binding!\n");
    };
    MakeUseCase.buildActionFilePath = function (action, grouping, config) {
        var path = "" + file_1.default.getCurrentDirectoryBase() + config.controllerPath + grouping + "/" + action + "Action.ts";
        if (file_1.default.directoryExists(path)) {
            throw new FileExistException_1.default(path);
        }
        return path;
    };
    MakeUseCase.buildAdapterFilePath = function (action, grouping, config) {
        var path = "" + file_1.default.getCurrentDirectoryBase() + config.adapterPath + grouping + "/" + action + "Adapter.ts";
        if (file_1.default.directoryExists(path)) {
            throw new FileExistException_1.default(path);
        }
        return path;
    };
    MakeUseCase.buildInputFilePath = function (action, grouping, isCommand, config) {
        var _a;
        var path = "";
        if (isCommand) {
            path = "" + file_1.default.getCurrentDirectoryBase() + config.commandInputPath + grouping + "/" + action + "Command.ts";
        }
        else {
            path = "" + file_1.default.getCurrentDirectoryBase() + ((_a = config.queryInputPath) !== null && _a !== void 0 ? _a : config.commandInputPath) + grouping + "/" + action + "Query.ts";
        }
        if (file_1.default.directoryExists(path)) {
            throw new FileExistException_1.default(path);
        }
        return path;
    };
    MakeUseCase.buildHandlerFilePath = function (action, grouping, isCommand, config) {
        var _a;
        var path = "";
        if (isCommand) {
            path = "" + file_1.default.getCurrentDirectoryBase() + config.commandHandlerPath + grouping + "/" + action + "Handler.ts";
        }
        else {
            path = "" + file_1.default.getCurrentDirectoryBase() + ((_a = config.queryHandlerPath) !== null && _a !== void 0 ? _a : config.commandHandlerPath) + grouping + "/" + action + "Handler.ts";
        }
        if (file_1.default.directoryExists(path)) {
            throw new FileExistException_1.default(path);
        }
        return path;
    };
    MakeUseCase.buildResultFilePath = function (action, grouping, config) {
        var path = "" + file_1.default.getCurrentDirectoryBase() + config.resultFilePath + grouping + "/" + action + "Result.ts";
        if (file_1.default.directoryExists(path)) {
            throw new FileExistException_1.default(path);
        }
        return path;
    };
    MakeUseCase.buildActionClass = function (action, grouping, isCommand) {
        var stub = isCommand
            ? file_1.default.resource_path("/stubs/ActionForCommand.stub")
            : file_1.default.resource_path("/stubs/ActionForQuery.stub");
        var stubContent = file_1.default.readFile(stub);
        stubContent = stubContent.replace(/{{action}}/gi, action);
        stubContent = stubContent.replace(/{{grouping}}/gi, grouping);
        return stubContent;
    };
    MakeUseCase.buildAdapterClass = function (action, grouping, isCommand) {
        var stub = isCommand
            ? file_1.default.resource_path("/stubs/CommandHttpAdapter.stub")
            : file_1.default.resource_path("/stubs/QueryHttpAdapter.stub");
        var stubContent = file_1.default.readFile(stub);
        stubContent = stubContent.replace(/{{action}}/gi, action);
        stubContent = stubContent.replace(/{{grouping}}/gi, grouping);
        return stubContent;
    };
    MakeUseCase.buildInputClass = function (action, grouping, attributes, isCommand) {
        attributes = attributes.trim();
        attributes = attributes.split(",");
        var classAttributes = "";
        var constructorParameters = "";
        var constructorAssignment = "";
        var getMethods = "";
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attribute = attributes_1[_i];
            var name_1 = attribute.split("-")[0];
            var type = attribute.split("-")[1];
            classAttributes += "    private " + name_1 + " " + (MakeUseCase.isNullable(type) ? "?:" : ":") + " " + (MakeUseCase.isNullable(type) ? type.slice(1) : type) + "; \n";
            constructorParameters += "        " + name_1 + (MakeUseCase.isNullable(type) ? "?:" : ":") + " " + (MakeUseCase.isNullable(type) ? type.slice(1) : type) + " " + (MakeUseCase.isLastElement(attribute, attributes) ? "" : ",\n");
            constructorAssignment += "        this." + name_1 + " = " + name_1 + (MakeUseCase.isLastElement(attribute, attributes) ? ";" : ";\n");
            getMethods += MakeUseCase.isFirstElement(attribute, attributes)
                ? "\n"
                : "\n\n";
            getMethods += "    public get" + (name_1.charAt(0).toUpperCase() + name_1.slice(1)) + "(): " + (MakeUseCase.isNullable(type) ? type.slice(1) : type) + " \n";
            getMethods += "    {\n";
            getMethods += "        return this." + name_1 + ";\n";
            getMethods += "    }";
        }
        var stub = isCommand
            ? file_1.default.resource_path("/stubs/Command.stub")
            : file_1.default.resource_path("/stubs/Query.stub");
        var stubContent = file_1.default.readFile(stub);
        stubContent = stubContent.replace(/{{grouping}}/gi, grouping);
        stubContent = stubContent.replace(/{{action}}/gi, action);
        stubContent = stubContent.replace(/{{class_attributes}}/gi, classAttributes);
        stubContent = stubContent.replace(/{{constructor_parameters}}/gi, constructorParameters);
        stubContent = stubContent.replace(/{{constructor_assignments}}/gi, constructorAssignment);
        stubContent = stubContent.replace(/{{get_methods}}/gi, getMethods);
        return stubContent;
    };
    MakeUseCase.buildHandlerClass = function (action, grouping, isCommand) {
        var stub = isCommand
            ? file_1.default.resource_path("/stubs/CommandHandler.stub")
            : file_1.default.resource_path("/stubs/QueryHandler.stub");
        var stubContent = file_1.default.readFile(stub);
        stubContent = stubContent.replace(/{{action}}/gi, action);
        stubContent = stubContent.replace(/{{grouping}}/gi, grouping);
        return stubContent;
    };
    MakeUseCase.buildResultClass = function (action, grouping) {
        var stub = file_1.default.resource_path("/stubs/QueryResult.stub");
        var stubContent = file_1.default.readFile(stub);
        stubContent = stubContent.replace(/{{action}}/gi, action);
        stubContent = stubContent.replace(/{{grouping}}/gi, grouping);
        return stubContent;
    };
    MakeUseCase.isNullable = function (type) {
        return type.includes("?");
    };
    MakeUseCase.isLastElement = function (index, attributes) {
        return attributes[attributes.length - 1] === index;
    };
    MakeUseCase.isFirstElement = function (index, attributes) {
        return attributes[0] === index;
    };
    MakeUseCase.makeDirectory = function (filePath) {
        filePath = filePath.slice(0, filePath.lastIndexOf("/"));
        if (!file_1.default.isDirectory(filePath)) {
            file_1.default.makeDirectory(filePath);
        }
    };
    MakeUseCase.fileSystemPut = function (filePath, fileClass) {
        file_1.default.writeFile(filePath, fileClass);
    };
    MakeUseCase.bindFile = function (filePath, fileName, config) {
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
            if (fileName.includes("Action") && content.includes("//Actions")) {
                newDiContent.push(content);
                newDiContent.push("DIContainer.bind(" + fileName + ").toSelf();");
                continue;
            }
            if (fileName.includes("Adapter") && content.includes("//Adapters")) {
                newDiContent.push(content);
                newDiContent.push("DIContainer.bind(" + fileName + ").toSelf();");
                continue;
            }
            if (fileName.includes("Handler") && content.includes("//Handlers")) {
                newDiContent.push(content);
                newDiContent.push("DIContainer.bind(" + fileName + ").toSelf();");
                continue;
            }
            newDiContent.push(content);
        }
        file_1.default.writeFile(diPath, newDiContent);
    };
    return MakeUseCase;
}());
exports.MakeUseCase = MakeUseCase;
//# sourceMappingURL=UseCase.js.map