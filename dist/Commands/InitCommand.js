"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCommand = void 0;
var file_1 = require("../Common/file");
var chalk = require("chalk");
var path = require("path");
var InitCommand = /** @class */ (function () {
    function InitCommand() {
        this.command = "init";
        this.describe = "Generates initial Base of project";
    }
    InitCommand.prototype.builder = function (args) {
        return args
            .option("t", {
            alias: "type",
            default: "default",
            describe: "Type of architecture",
        })
            .option("r", {
            alias: "cqrs",
            default: "no",
            describe: "Should create with command/query responsibility segregation differentiation",
        });
    };
    InitCommand.prototype.handler = function (args) {
        var projectExist = InitCommand.checkIfExistAnyProject();
        if (projectExist) {
            var hasProjectScaffolding = InitCommand.checkIfScaffoldingExist();
            if (hasProjectScaffolding) {
                console.log(chalk.black.bgRed("Error during scaffolding creation: "));
                console.error("Error: scaffolding has been exist");
                process.exit(1);
            }
        }
        var type = args.type;
        var cqrs = args.cqrs;
        if (type === "default") {
            InitCommand.createAppFolder();
            InitCommand.createConfigFile("default", false);
            if (cqrs === "yes") {
                console.info(chalk.yellowBright("Warning! default app not support cqrs"));
            }
        }
        else {
            InitCommand.createOnionFolders(cqrs === "yes");
            InitCommand.createConfigFile("onion", cqrs === "yes");
        }
        InitCommand.createEnvironmentFiles();
        console.info(chalk.greenBright("Bootstrapping ready! start to code!"));
    };
    InitCommand.checkIfExistAnyProject = function () {
        var _path = path.join(file_1.default.getCurrentDirectoryBase(), "/package.json");
        return file_1.default.directoryExists(_path);
    };
    InitCommand.checkIfScaffoldingExist = function () {
        var path = file_1.default.getCurrentDirectoryBase() + "/config.json";
        return file_1.default.directoryExists(path);
    };
    InitCommand.createAppFolder = function () {
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "/src/App"));
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "/src/App/Http/Controllers"));
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "/src/App/Http/Middlewares"));
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "/src/App/Services"));
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "src/App/Services/Validation"));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/Services/Validation/JoiValidationService.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/JoiValidationService.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/Services/Validation/ValidationService.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/ValidationService.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/Services/Validation/BaseErrorSchema.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/BaseErrorSchema.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/Services/Validation/ErrorMessages.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/ErrorMessages.stub")));
        var loggerStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/WinstonLoggerService.stub"));
        loggerStub = loggerStub.replace(/{{interface_path}}/gi, "./LoggerService");
        loggerStub = loggerStub.replace(/{{log_levels_path}}/gi, "../../Enums/LogLevels");
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "src/App/Services/Logger"));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/Services/Logger/WinstonLoggerService.ts", loggerStub);
        var loggerInterfaceStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/LoggerService.stub"));
        loggerInterfaceStub = loggerInterfaceStub.replace(/{{log_levels_path}}/gi, "../../Enums/LogLevels");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/Services/Logger/LoggerService.ts", loggerInterfaceStub);
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "/src/App/Repositories"));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/Repositories/TypeRepository.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/TypeRepository.stub")));
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "/src/App/Exceptions"));
        InitCommand.copyApplicationExceptions(file_1.default.getCurrentDirectoryBase() + "/src/App/Exceptions");
        InitCommand.copyPresentationExceptions(file_1.default.getCurrentDirectoryBase() + "/src/App/Exceptions");
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "/src/App/Enums"));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/Enums/HttpCodes.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/HttpCodes.stub")));
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/App/Enums");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/Enums/LogLevels.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/LogLevels.stub")));
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "/src/App/Models"));
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "/src/database/migrations"));
        var databaseConnectionStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/DatabaseConnection.stub"));
        databaseConnectionStub = databaseConnectionStub.replace(/{{config_path}}/gi, "../config/mode");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/database/DatabaseConnection.ts", databaseConnectionStub);
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "src/database/Config"));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/database/Config/ProductionConfig.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/DatabaseProductionConfig.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/database/Config/DevelopmentConfig.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/DatabaseDevelopmentConfig.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/database/Config/TestingConfig.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/DatabaseTestingConfig.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/database/Config/ConfigVariables.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/DatabaseCommonConfig.stub")));
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "src/config"));
        file_1.default.writeFile(path.join(file_1.default.getCurrentDirectoryBase(), "src/config/mode.ts"), file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/ConfigModes.stub")));
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/App/DI");
        var diStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/di.config.stub"));
        diStub = diStub.replace(/{{router_path}}/gi, "../../routes");
        diStub = diStub.replace(/{{validation_interface_path}}/gi, "../Services/Validation/ValidationService");
        diStub = diStub.replace(/{{logger_interface_path}}/gi, "../Services/Logger/LoggerService");
        diStub = diStub.replace(/{{validation_service_path}}/gi, "../Services/Validation/JoiValidationService");
        diStub = diStub.replace(/{{logger_service_path}}/gi, "../Services/Logger/WinstonLoggerService");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/DI/di.config.ts", diStub);
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/DI/interfaces.types.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/interfaces.types.stub")));
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/App/Debug");
        var errorHandlerStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/ErrorHandler.stub"));
        errorHandlerStub = errorHandlerStub.replace(/{{application_exceptions_path}}/gi, "../Exceptions");
        errorHandlerStub = errorHandlerStub.replace(/{{presentation_exceptions_path}}/gi, "../Exceptions");
        errorHandlerStub = errorHandlerStub.replace(/{{di_path}}/gi, "../DI");
        errorHandlerStub = errorHandlerStub.replace(/{{log_levels_path}}/gi, "../Enums/LogLevels");
        errorHandlerStub = errorHandlerStub.replace(/{{services_path}}/gi, "../Services/Logger");
        errorHandlerStub = errorHandlerStub.replace(/{{error_messages_path}}/gi, "../Services/Validation/");
        errorHandlerStub = errorHandlerStub.replace(/{{http_codes_path}}/gi, "../Enums");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/Debug/ErrorHandler.ts", errorHandlerStub);
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App/Debug/customResponse.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/customResponse.stub")));
        file_1.default.makeDirectory(path.join(file_1.default.getCurrentDirectoryBase(), "/src/routes"));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/routes/index.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/Router.stub")));
        file_1.default.writeFile(path.join(file_1.default.getCurrentDirectoryBase(), "/tsconfig.json"), InitCommand.getTsConfigTemplate());
        file_1.default.writeFile(path.join(file_1.default.getCurrentDirectoryBase(), "/.env"), InitCommand.createEnvironmentFiles());
        var serverStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/server.stub"));
        serverStub = serverStub.replace(/{{di_path}}/gi, "App/DI/di.config");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/server.ts", serverStub);
        var appStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/App.stub"));
        appStub = appStub.replace(/{{database_connection_path}}/gi, "database/DatabaseConnection");
        appStub = appStub.replace(/{{error_handler_path}}/gi, "App/Debug/ErrorHandler");
        appStub = appStub.replace(/{{di_path}}/gi, "App/DI/di.config");
        appStub = appStub.replace(/{{routes_path}}/gi, "routes");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App.ts", appStub);
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/package.json", InitCommand.getNodePackageTemplate());
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/.gitignore", InitCommand.getGitIgnoreFile());
    };
    InitCommand.createOnionFolders = function (cqrs) {
        /**
         * Presentation dependencies
         */
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Presentation");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Actions");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Adapters");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Presenters");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Exceptions");
        InitCommand.copyPresentationExceptions(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Exceptions");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Routes");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Routes/index.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/Router.stub")));
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Middlewares");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Enums");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Enums/HttpCodes.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/HttpCodes.stub")));
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Validations/Utils");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Validations/Utils/JoiValidationService.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/JoiValidationService.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Validations/Utils/ValidationService.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/ValidationService.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Validations/Utils/BaseErrorSchema.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/BaseErrorSchema.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Validations/Utils/ErrorMessages.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/ErrorMessages.stub")));
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Presentation/Http/Validations/Schemas");
        /**
         * Application dependencies
         */
        if (cqrs) {
            file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Application/Commands/Command");
            file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Application/Commands/Handler");
            file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Application/Queries/Query");
            file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Application/Queries/Handler");
            file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Application/Queries/Result");
        }
        else {
            file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Application/Commands");
            file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Application/Handlers");
        }
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Application/Exceptions");
        InitCommand.copyApplicationExceptions(file_1.default.getCurrentDirectoryBase() + "/src/Application/Exceptions");
        /**
         * Domain dependencies
         */
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Domain/Entities");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Domain/Interfaces");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Domain/Interfaces/Repositories");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Domain/Interfaces/Services");
        var loggerInterfaceStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/LoggerService.stub"));
        loggerInterfaceStub = loggerInterfaceStub.replace(/{{log_levels_path}}/gi, "../../Enums/LogLevels");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Domain/Interfaces/Services/LoggerService.ts", loggerInterfaceStub);
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Domain/Enums");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Domain/Enums/LogLevels.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/LogLevels.stub")));
        /**
         * Infrastructure dependencies
         */
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Persistence/Repositories");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Persistence/Repositories/TypeRepository.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/TypeRepository.stub")));
        var loggerStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/WinstonLoggerService.stub"));
        loggerStub = loggerStub.replace(/{{interface_path}}/gi, "../../../Domain/Interfaces/Services/LoggerService");
        loggerStub = loggerStub.replace(/{{log_levels_path}}/gi, "../../../Domain/Enums/LogLevels");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Logger/Providers");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Logger/Providers/WinstonLoggerService.ts", loggerStub);
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Persistence/Migrations");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Persistence/Config");
        var databaseConnectionStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/DatabaseConnection.stub"));
        databaseConnectionStub = databaseConnectionStub.replace(/{{config_path}}/gi, "../../Config/mode");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Persistence/DatabaseConnection.ts", databaseConnectionStub);
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Persistence/Config/ProductionConfig.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/DatabaseProductionConfig.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Persistence/Config/DevelopmentConfig.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/DatabaseDevelopmentConfig.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Persistence/Config/TestingConfig.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/DatabaseTestingConfig.stub")));
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Persistence/Config/ConfigVariables.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/DatabaseCommonConfig.stub")));
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/DI");
        var diStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/di.config.stub"));
        diStub = diStub.replace(/{{router_path}}/gi, "../../Presentation/Http/Routes");
        diStub = diStub.replace(/{{validation_interface_path}}/gi, "../../Presentation/Http/Validations/Utils/ValidationService");
        diStub = diStub.replace(/{{logger_interface_path}}/gi, "../../Domain/Interfaces/Services/LoggerService");
        diStub = diStub.replace(/{{validation_service_path}}/gi, "../../Presentation/Http/Validations/Utils/JoiValidationService");
        diStub = diStub.replace(/{{logger_service_path}}/gi, "../../Infrastructure/Logger/Providers/WinstonLoggerService");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/DI/di.config.ts", diStub);
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/DI/interfaces.types.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/interfaces.types.stub")));
        var errorHandlerStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/ErrorHandler.stub"));
        errorHandlerStub = errorHandlerStub.replace(/{{application_exceptions_path}}/gi, "../../Application/Exceptions");
        errorHandlerStub = errorHandlerStub.replace(/{{presentation_exceptions_path}}/gi, "../../Presentation/Http/Exceptions");
        errorHandlerStub = errorHandlerStub.replace(/{{di_path}}/gi, "../DI");
        errorHandlerStub = errorHandlerStub.replace(/{{http_codes_path}}/gi, "../../Presentation/Http/Enums");
        errorHandlerStub = errorHandlerStub.replace(/{{log_levels_path}}/gi, "../../Domain/Enums/LogLevels");
        errorHandlerStub = errorHandlerStub.replace(/{{services_path}}/gi, "../../Domain/Interfaces/Services");
        errorHandlerStub = errorHandlerStub.replace(/{{error_messages_path}}/gi, "../../Presentation/Http/Validations/Utils");
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Debug");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Debug/ErrorHandler.ts", errorHandlerStub);
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Infrastructure/Debug/customResponse.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/customResponse.stub")));
        file_1.default.makeDirectory(file_1.default.getCurrentDirectoryBase() + "/src/Config");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/Config/mode.ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/ConfigModes.stub")));
        /**
         * Root dependencies
         */
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/tsconfig.json", InitCommand.getTsConfigTemplate());
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/.env", InitCommand.createEnvironmentFiles());
        var serverStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/server.stub"));
        serverStub = serverStub.replace(/{{di_path}}/gi, "Infrastructure/DI/di.config");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/server.ts", serverStub);
        var appStub = file_1.default.readFile(file_1.default.resource_path("/stubs/Utils/App.stub"));
        appStub = appStub.replace(/{{database_connection_path}}/gi, "Infrastructure/Persistence/DatabaseConnection");
        appStub = appStub.replace(/{{error_handler_path}}/gi, "Infrastructure/Debug/ErrorHandler");
        appStub = appStub.replace(/{{routes_path}}/gi, "Presentation/Http/Routes");
        appStub = appStub.replace(/{{di_path}}/gi, "Infrastructure/DI/di.config");
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/src/App.ts", appStub);
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/package.json", InitCommand.getNodePackageTemplate());
        file_1.default.writeFile(file_1.default.getCurrentDirectoryBase() + "/.gitignore", InitCommand.getGitIgnoreFile());
    };
    InitCommand.createConfigFile = function (type, cqrs) {
        var filePath = path.join(file_1.default.getCurrentDirectoryBase(), "/config.json");
        var content = InitCommand.getConfigContentFromType(type, cqrs);
        file_1.default.writeFile(filePath, JSON.stringify(content, undefined, 3));
    };
    InitCommand.getConfigContentFromType = function (type, cqrs) {
        if (cqrs) {
            return {
                type: "onion",
                cqrs: cqrs,
                adapterPath: "src/Presentation/Http/Adapters/",
                commandHandlerPath: type === "default"
                    ? "src/Application/Handlers/"
                    : "src/Application/Commands/Handler/",
                commandInputPath: type === "default"
                    ? "src/Application/Commands/"
                    : "src/Application/Commands/Command/",
                controllerPath: "src/Presentation/Http/Actions/",
                database: "MySql",
                modelPath: "src/Domain/Entities/",
                repositoryInterfacePath: "src/Domain/Interfaces/Repositories/",
                repositoryPath: "src/Infrastructure/Persistence/Repositories/",
                shouldCreateQueryResult: type !== "default",
                shouldCreateRepositoryInterface: true,
                diPath: "src/Infrastructure/DI/di.config.ts",
            };
        }
        return {
            diPath: "src/App/DI/di.config.ts",
            adapterPath: "src/",
            commandHandlerPath: "src/App/",
            commandInputPath: "src/",
            controllerPath: "src/App/Http/Controllers/",
            cqrs: false,
            database: "Mysql",
            modelPath: "src/App/Models/",
            repositoryInterfacePath: "src/App/Interfaces/Repositories/",
            repositoryPath: "src/App/Repositories/",
            shouldCreateQueryResult: false,
            shouldCreateRepositoryInterface: false,
            type: "default",
        };
    };
    InitCommand.getTsConfigTemplate = function () {
        return JSON.stringify({
            compilerOptions: {
                lib: ["es5", "es6"],
                target: "es5",
                module: "commonjs",
                moduleResolution: "node",
                outDir: "./build",
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                sourceMap: true,
                esModuleInterop: true,
            },
        }, undefined, 3);
    };
    /**
     * Gets contents of the .gitignore file.
     */
    InitCommand.getGitIgnoreFile = function () {
        return ".idea/\n.vscode/\nnode_modules/\nbuild/\ndist/\ntmp/\ntemp/\nyarn.lock";
    };
    InitCommand.createEnvironmentFiles = function () {
        var r = Math.random().toString(36);
        return "TYPEORM_DATABASE=database\nTYPEORM_USERNAME=test\nTYPEORM_PASSWORD=test\nTYPEORM_HOST=mysql\nTYPEORM_PORT=3306\n    \nNODE_ENV=development\n    \nHASH_ROUND=12\n    \nJWT_SECRET=" + r + "\nJWT_EXPIRES_IN=1h\n    \nMAIL_APIKEY=\n    \nNO_REPLY_EMAIL=\n    \nDEBUG_EMAIL=";
    };
    InitCommand.copyPresentationExceptions = function (path) {
        var exceptions = [
            "AuthenticationException",
            "AuthorizationException",
            "BadRequestException",
            "BaseHttpException",
            "ForeignKeyConstraintException",
            "InternalErrorException",
            "NotFoundException",
            "UnprocessableEntityException",
        ];
        for (var _i = 0, exceptions_1 = exceptions; _i < exceptions_1.length; _i++) {
            var exception = exceptions_1[_i];
            file_1.default.writeFile(path + "/" + exception + ".ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Exceptions/" + exception + ".stub")));
        }
    };
    InitCommand.copyApplicationExceptions = function (path) {
        var exceptions = [
            "EntityNotFoundException",
            "ValidationException",
            "AuthenticationFailed",
            "AuthorizationFailed",
            "CannotPasswordMatch",
            "ApplicationException",
            "ForeignKeyConstraintFailed",
            "RelatedEntitiesConstraintFailed",
            "EmailAlreadyExist",
        ];
        for (var _i = 0, exceptions_2 = exceptions; _i < exceptions_2.length; _i++) {
            var exception = exceptions_2[_i];
            file_1.default.writeFile(path + "/" + exception + ".ts", file_1.default.readFile(file_1.default.resource_path("/stubs/Exceptions/" + exception + ".stub")));
        }
    };
    InitCommand.getNodePackageTemplate = function () {
        return JSON.stringify({
            name: "server",
            version: "1.0.0",
            main: "index.js",
            license: "MIT",
            scripts: {
                "make:usecase": "node ./commands/generators",
                start: 'nodemon -e ts --exec "yarn run dev:transpile"',
                "dev:transpile": "tsc && node --unhandled-rejections=strict --inspect=0.0.0.0 dist/server.js",
                "prettier:run": "yarn prettier --write src/**/*.ts",
                "make:migration": "yarn typeorm migration:create -d ./src/Infrastructure/Persistence/Migrations -n",
                "CI:test": "exit 0",
            },
            dependencies: {
                "cookie-parser": "^1.4.5",
                cors: "^2.8.5",
                express: "^4.17.1",
                helmet: "^4.4.1",
                inversify: "^5.0.5",
                joi: "^17.3.0",
                jsonwebtoken: "^8.5.1",
                "reflect-metadata": "^0.1.13",
                typeorm: "^0.2.30",
                morgan: "^1.10.0",
                mysql: "^2.18.1",
                winston: "^3.3.3",
            },
            devDependencies: {
                "@types/express": "^4.17.11",
                "@types/node": "^14.14.21",
                "@types/jsonwebtoken": "^8.5.0",
                husky: "^4.3.8",
                nodemon: "^2.0.7",
                prettier: "^2.2.1",
                "ts-node": "^9.1.1",
                typescript: "^4.1.3",
            },
            husky: {
                hooks: {
                    "pre-commit": "yarn prettier:run && git add -A",
                },
            },
        }, undefined, 3);
    };
    return InitCommand;
}());
exports.InitCommand = InitCommand;
//# sourceMappingURL=InitCommand.js.map