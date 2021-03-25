import * as yargs from "yargs";
import file from "../Common/file";
import * as chalk from "chalk";
import {Config} from "../Common/Types/Config";
import * as path from "path";

export class InitCommand implements yargs.CommandModule {
    command = "init";
    describe = "Generates initial Base of project";

    builder(args: yargs.Argv) {
        return args
            .option("d", {
                alias: "dir",
                default: ".",
                describe: "path dir of start connection",
            })
            .option("t", {
                alias: "type",
                default: "default",
                describe: "Type of architecture",
            })
            .option("r", {
                alias: "cqrs",
                default: "no",
                describe:
                    "Should create with command/query responsibility segregation differentiation",
            });
    }

    handler(args: yargs.Arguments): void {
        const dir = args.dir as string;

        const projectExist = InitCommand.checkIfExistAnyProject(dir);

        if (projectExist) {
            const hasProjectScaffolding = InitCommand.checkIfScaffoldingExist();
            if (hasProjectScaffolding) {
                console.log(chalk.black.bgRed("Error during scaffolding creation: "));
                console.error("Error: scaffolding has been exist");
                process.exit(1);
            }
        }
        const type = args.type as string;
        const cqrs = args.cqrs as string;

        if (type === "default") {
            InitCommand.createAppFolder();
            InitCommand.createConfigFile("default", false, dir);
        } else {
            InitCommand.createOnionFolders(cqrs === "yes");
            InitCommand.createConfigFile("onion", cqrs === 'yes', dir);
        }

        InitCommand.createEnvironmentFiles();
    }

    //TODO: check dir passed from args
    private static checkIfExistAnyProject(dir: string) {
        const _path = path.join(
            file.getCurrentDirectoryBase(),
            dir,
            `/package.json`
        );

        return file.directoryExists(_path);
    }

    private static checkIfScaffoldingExist() {
        const path = `${file.getCurrentDirectoryBase()}/config.json`;

        return file.directoryExists(path);
    }

    private static createAppFolder() {
        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), "/src/App")
        );

        file.makeDirectory(
            path.join(
                file.getCurrentDirectoryBase(),
                `/src/App/Http/Controllers`
            )
        );

        file.makeDirectory(
            path.join(
                file.getCurrentDirectoryBase(),
                `/src/App/Http/Middlewares`
            )
        );

        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), `/src/App/Services`)
        );

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/JoiValidationService.ts`,
            file.readFile(file.resource_path('/stubs/Utils/JoiValidationService.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/ValidationService.ts`,
            file.readFile(file.resource_path('/stubs/Utils/ValidationService.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/BaseErrorSchema.ts`,
            file.readFile(file.resource_path('/stubs/Utils/BaseErrorSchema.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/ErrorMessages.ts`,
            file.readFile(file.resource_path('/stubs/Utils/ErrorMessages.stub'))
        );

        let loggerStub = file.readFile(file.resource_path('/stubs/Utils/WinstonLoggerService.stub')) //TODO: add dependencies
        loggerStub = loggerStub.replace(/{{interface_path}}/gi, './LoggerService');
        loggerStub = loggerStub.replace(/{{log_levels_path}}/gi, '../Enums/LogLevels');

        file.writeFile(`${file.getCurrentDirectoryBase()}/src/App/Services/WinstonLoggerService.ts`, loggerStub);
        file.writeFile(`${file.getCurrentDirectoryBase()}/src/App/Services/LoggerService.ts`,
            file.readFile(file.resource_path(`/stubs/Utils/LoggerService.stub`)));

        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), `/src/App/Repositories`)
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App/Repositories/TypeRepository.ts`,
            file.readFile(file.resource_path('/stubs/Utils/TypeRepository.stub'))
        );

        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), `/src/App/Enums`)
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App/Enums/HttpCodes.ts`,
            file.readFile(file.resource_path('/stubs/Utils/HttpCodes.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App/Enums/LogLevels.ts`,
            file.readFile(file.resource_path('/stubs/Utils/LogLevels.stub'))
        );

        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), `/src/App/Models`)
        );

        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), `/src/database/migrations`)
        );

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/database/DatabaseConnection.ts`,
            file.readFile(file.resource_path('/stubs/Utils/DatabaseConnection.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/database/Config/ProductionConfig.ts`,
            file.readFile(file.resource_path('/stubs/Utils/DatabaseProductionConfig.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/database/Config/DevelopmentConfig.ts`,
            file.readFile(file.resource_path('/stubs/Utils/DatabaseDevelopmentConfig.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/database/Config/TestingConfig.ts`,
            file.readFile(file.resource_path('/stubs/Utils/DatabaseTestingConfig.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/database/Config/ConfigVariables.ts`,
            file.readFile(file.resource_path('/stubs/Utils/DatabaseCommonConfig.stub'))
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/App/DI`
        );
        let diStub = file.readFile(file.resource_path('/stubs/Utils/di.config.stub'));
        diStub = diStub.replace(/{{router_path}}/gi, '../../routes');
        diStub = diStub.replace(/{{validation_interface_path}}/gi, '../Services/ValidationService');
        diStub = diStub.replace(/{{logger_interface_path}}/gi, '../Services/Logger/LoggerService');
        diStub = diStub.replace(/{{validation_service_path}}/gi, '../Services/JoiValidationService');
        diStub = diStub.replace(/{{logger_service_path}}/gi, '../Services/Logger/WinstonLoggerService');

        file.writeFile(`${file.getCurrentDirectoryBase()}/src/App/DI/di.config.ts`, diStub);
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App/DI/interfaces.types.ts`,
            file.readFile(file.resource_path('/stubs/Utils/interfaces.types.stub'))
        );
        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/App/Debug`
        );
        let errorHandlerStub = file.readFile(file.resource_path('/stubs/Utils/ErrorHandler.stub')) //TODO: add dependencies
        errorHandlerStub = errorHandlerStub.replace(/{{application_exceptions_path}}/gi, '../Exceptions');
        errorHandlerStub = errorHandlerStub.replace(/{{presentation_exceptions_path}}/gi, '../Exceptions');
        errorHandlerStub = errorHandlerStub.replace(/{{di_path}}/gi, '../DI');
        errorHandlerStub = errorHandlerStub.replace(/{{log_levels_path}}/gi, '../Enums/LogLevels');
        errorHandlerStub = errorHandlerStub.replace(/{{services_path}}/gi, '../Services/Logger');
        errorHandlerStub = errorHandlerStub.replace(/{{error_messages_path}}/gi, '../Services/Validation/');

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App/Debug/ErrorHandler.ts`,
            errorHandlerStub
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App/Debug/customResponse.ts`,
            file.readFile(file.resource_path('/stubs/Utils/customResponse.stub'))
        );

        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), `/src/routes`)
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/routes/index.ts`,
            file.readFile(file.resource_path('/stubs/Utils/Router.stub'))
        );

        file.writeFile(
            path.join(file.getCurrentDirectoryBase(), `/tsconfig.json`),
            InitCommand.getTsConfigTemplate()
        );

        file.writeFile(
            path.join(file.getCurrentDirectoryBase(), `/.env`),
            InitCommand.createEnvironmentFiles()
        );

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/server.ts`,
            file.readFile(file.resource_path('/stubs/Utils/server.stub'))
        );
        let appStub = file.readFile(file.resource_path('/stubs/Utils/App.stub'));
        appStub = appStub.replace(/{{database_connection_path}}/gi, 'database/DatabaseConnection');
        appStub = appStub.replace(/{{error_handler_path}}/gi, 'Debug/ErrorHandler');
        appStub = appStub.replace(/{{routes_path}}/gi, 'routes');

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App.ts`,
            appStub
        );
    }

    private static createOnionFolders(cqrs: boolean) {

        /**
         * Presentation dependencies
         */
        file.makeDirectory(`${file.getCurrentDirectoryBase()}/src/Presentation`);

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Actions`
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Adapters`
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Presenters`
        );


        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Exceptions`
        );
        InitCommand.copyPresentationExceptions(`${file.getCurrentDirectoryBase()}/src/Presentation/Http/Exceptions`);

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Routes`
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Routes/index.ts`,
            file.readFile(file.resource_path('/stubs/Utils/Router.stub'))
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Middlewares`
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Utils`
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Utils/JoiValidationService.ts`,
            file.readFile(file.resource_path('/stubs/Utils/JoiValidationService.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Utils/ValidationService.ts`,
            file.readFile(file.resource_path('/stubs/Utils/ValidationService.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Utils/BaseErrorSchema.ts`,
            file.readFile(file.resource_path('/stubs/Utils/BaseErrorSchema.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Utils/ErrorMessages.ts`,
            file.readFile(file.resource_path('/stubs/Utils/ErrorMessages.stub'))
        );


        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Schemas`
        );

        /**
         * Application dependencies
         */
        if (cqrs) {
            file.makeDirectory(
                `${file.getCurrentDirectoryBase()}/src/Application/Commands/Command`
            );

            file.makeDirectory(
                `${file.getCurrentDirectoryBase()}/src/Application/Commands/Handler`
            );

            file.makeDirectory(
                `${file.getCurrentDirectoryBase()}/src/Application/Queries/Query`
            );

            file.makeDirectory(
                `${file.getCurrentDirectoryBase()}/src/Application/Queries/Handler`
            );

            file.makeDirectory(
                `${file.getCurrentDirectoryBase()}/src/Application/Queries/Result`
            );
        } else {
            file.makeDirectory(
                `${file.getCurrentDirectoryBase()}/src/Application/Commands`
            );

            file.makeDirectory(
                `${file.getCurrentDirectoryBase()}/src/Application/Handlers`
            );
        }

        /**
         * Domain dependencies
         */
        file.makeDirectory(`${file.getCurrentDirectoryBase()}/src/Domain/Entities`);

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Domain/Interfaces`
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Domain/Interfaces/Repositories`
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Domain/Interfaces/Services`
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Domain/Interfaces/Services/LoggerService.ts`,
            file.readFile(file.resource_path('/stubs/Utils/LoggerService.stub'))
        );

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Domain/Enums/LogLevels.ts`,
            file.readFile(file.resource_path('/stubs/Utils/LogLevels.stub'))
        );

        /**
         * Infrastructure dependencies
         */
        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Repositories`
        );

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Repositories/TypeRepository.ts`,
            file.readFile(file.resource_path('/stubs/Utils/TypeRepository.stub'))
        );

        let loggerStub = file.readFile(file.resource_path('/stubs/Utils/WinstonLoggerService.stub')) //TODO: add dependencies
        loggerStub = loggerStub.replace(/{{interface_path}}/gi, '../../../Domain/Interfaces/Services/LoggerService');
        loggerStub = loggerStub.replace(/{{log_levels_path}}/gi, '../../../Domain/Enums/LogLevels');

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Logger/Providers/WinstonLoggerService.ts`,
            loggerStub
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Migrations`
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/DatabaseConnection.ts`,
            file.readFile(file.resource_path('/stubs/Utils/DatabaseConnection.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Config/ProductionConfig.ts`,
            file.readFile(file.resource_path('/stubs/Utils/DatabaseProductionConfig.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Config/DevelopmentConfig.ts`,
            file.readFile(file.resource_path('/stubs/Utils/DatabaseDevelopmentConfig.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Config/TestingConfig.ts`,
            file.readFile(file.resource_path('/stubs/Utils/DatabaseTestingConfig.stub'))
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Config/ConfigVariables.ts`,
            file.readFile(file.resource_path('/stubs/Utils/DatabaseCommonConfig.stub'))
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/DI`
        );
        let diStub = file.readFile(file.resource_path('/stubs/Utils/di.config.stub'));
        diStub = diStub.replace(/{{router_path}}/gi, '../../Presentation/Http/Routes');
        diStub = diStub.replace(/{{validation_interface_path}}/gi, '../../Presentation/Http/Validations/Utils/ValidationService');
        diStub = diStub.replace(/{{logger_interface_path}}/gi, '../../Domain/Interfaces/Services/LoggerService');
        diStub = diStub.replace(/{{validation_service_path}}/gi, '../../Presentation/Http/Validations/Utils/JoiValidationService');
        diStub = diStub.replace(/{{logger_service_path}}/gi, '../../Infrastructure/Logger/Providers/WinstonLoggerService');

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/DI/di.config.ts`,
            diStub
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/DI/interfaces.types.ts`,
            file.readFile(file.resource_path('/stubs/Utils/interfaces.types.stub'))
        );

        let errorHandlerStub = file.readFile(file.resource_path('/stubs/Utils/ErrorHandler.stub'))
        errorHandlerStub = errorHandlerStub.replace(/{{application_exceptions_path}}/gi, '../../../Presentation/Http/Exceptions');
        errorHandlerStub = errorHandlerStub.replace(/{{presentation_exceptions_path}}/gi, '../../../Application/Exceptions');
        errorHandlerStub = errorHandlerStub.replace(/{{di_path}}/gi, '../DI');
        errorHandlerStub = errorHandlerStub.replace(/{{log_levels_path}}/gi, '../../../Domain/Enums/LogLevels');
        errorHandlerStub = errorHandlerStub.replace(/{{services_path}}/gi, '../../../Domain/Interfaces/Services');
        errorHandlerStub = errorHandlerStub.replace(/{{error_messages_path}}/gi, '../../../Presentation/Http/Validations/Utils');

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App/Debug/ErrorHandler.ts`,
            errorHandlerStub
        );
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Debug/customResponse.ts`,
            file.readFile(file.resource_path('/stubs/Utils/customResponse.stub'))
        );

        /**
         * Root dependencies
         */
        file.writeFile(
            `${file.getCurrentDirectoryBase()}/tsconfig.json`,
            InitCommand.getTsConfigTemplate()
        );

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/.env`,
            InitCommand.createEnvironmentFiles()
        );

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/server.ts`,
            file.readFile(file.resource_path('/stubs/Utils/server.stub'))
        );
        let appStub = file.readFile(file.resource_path('/stubs/Utils/App.stub'));
        appStub = appStub.replace(/{{database_connection_path}}/gi, 'Infrastructure/Persistence/DatabaseConnection');
        appStub = appStub.replace(/{{error_handler_path}}/gi, 'Infrastructure/Debug/ErrorHandler');
        appStub = appStub.replace(/{{routes_path}}/gi, 'Presentation/Http/Routes');

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/src/App.ts`,
            appStub
        );
    }

    private static createConfigFile(type: string, cqrs: boolean, dir: string) {
        const filePath = path.join(
            file.getCurrentDirectoryBase(),
            dir,
            `/config.json`
        );

        const content = InitCommand.getConfigContentFromType(type, cqrs);

        file.writeFile(filePath, JSON.stringify(content, undefined, 3));

        const ormFile = path.join(
            file.getCurrentDirectoryBase(),
            dir,
            `/ormconfig.json`
        );

        const ormContent = {
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "test",
            password: "test",
            database: "test",
            synchronize: true,
            logging: false,
            entities: ["src/App/Models/**/*.ts"],
            migrations: ["src/database/migrations/**/*.ts"],
            cli: {
                entitiesDir: "src/App/Models",
                migrationsDir: "src/database/migrations",
            },
        };

        file.writeFile(ormFile, JSON.stringify(ormContent, undefined, 3));
    }

    private static getConfigContentFromType(type: string, cqrs: boolean): Config {
        if (cqrs) {
            return {
                type: "onion",
                cqrs,
                adapterPath: "src/Presentation/Http/Adapters/",
                commandHandlerPath: type === 'default' ? "src/Application/Handlers/" : "src/Application/Commands/Handler/",
                commandInputPath: type === 'default' ? "src/Application/Commands/" : "src/Application/Commands/Command/",
                controllerPath: "src/Presentation/Http/Actions/",
                database: "MySql",
                modelPath: "src/Domain/Entities/",
                repositoryInterfacePath: "src/Domain/Interfaces/Repositories/",
                repositoryPath: "src/Infrastructure/Persistence/Repositories/",
                shouldCreateQueryResult: type !== 'default',
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
    }

    protected static getTsConfigTemplate(): string {
        return JSON.stringify(
            {
                compilerOptions: {
                    lib: ["es5", "es6"],
                    target: "es5",
                    module: "commonjs",
                    moduleResolution: "node",
                    outDir: "./build",
                    emitDecoratorMetadata: true,
                    experimentalDecorators: true,
                    sourceMap: true,
                },
            },
            undefined,
            3
        );
    }

    private static createEnvironmentFiles() {
        let r = Math.random().toString(36);

        return `
    TYPEORM_DATABASE=database
    TYPEORM_USERNAME=test
    TYPEORM_PASSWORD=test
    TYPEORM_HOST=mysql
    TYPEORM_PORT=3306
    
    NODE_ENV=development
    
    HASH_ROUND=12
    
    JWT_SECRET=${r}
    JWT_EXPIRES_IN=1h
    
    MAIL_APIKEY=
    
    NO_REPLY_EMAIL=
    
    DEBUG_EMAIL=`;
    }

    private static copyPresentationExceptions(path: string) {

    }
}
