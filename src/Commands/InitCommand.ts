import * as yargs from "yargs";
import file from "../Common/file";
import * as chalk from "chalk";
import { Config } from "../Common/Types/Config";
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
            InitCommand.createAppFolder(dir);
            InitCommand.createConfigFile("default", false, dir);
        } else {
            InitCommand.createOnionFolders(cqrs === "no");
            InitCommand.createConfigFile("onion", true, dir);
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

    private static createAppFolder(dir: string) {
        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), dir, "/src/App")
        );

        file.makeDirectory(
            path.join(
                file.getCurrentDirectoryBase(),
                dir,
                `/src/App/Http/Controllers`
            )
        );

        file.makeDirectory(
            path.join(
                file.getCurrentDirectoryBase(),
                dir,
                `/src/App/Http/Middlewares`
            )
        );

        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), dir, `/src/App/Services`)
        );

        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), dir, `/src/App/Repositories`)
        );

        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), dir, `/src/App/Models`)
        );

        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), dir, `/src/database/migrations`)
        );

        file.makeDirectory(
            path.join(file.getCurrentDirectoryBase(), dir, `/src/routes`)
        );

        file.writeFile(
            path.join(file.getCurrentDirectoryBase(), dir, `/tsconfig.json`),
            InitCommand.getTsConfigTemplate()
        );

        file.writeFile(
            path.join(file.getCurrentDirectoryBase(), dir, `/.env`),
            InitCommand.createEnvironmentFiles()
        );
    }

    private static createOnionFolders(cqrs: boolean) {
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
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Enums`
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Exceptions`
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Routes`
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Middlewares`
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Utils`
        );

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Schemas`
        );

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

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Repositories`
        );

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

        file.makeDirectory(
            `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Migrations`
        );

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/tsconfig.json`,
            InitCommand.getTsConfigTemplate()
        );

        file.writeFile(
            `${file.getCurrentDirectoryBase()}/.env`,
            InitCommand.createEnvironmentFiles()
        );
    }

    private static createConfigFile(type: string, cqrs: boolean, dir: string) {
        const filePath = path.join(
            file.getCurrentDirectoryBase(),
            dir,
            `/config.json`
        );

        const content = InitCommand.getConfigContentFromType(cqrs);

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

    private static getConfigContentFromType(cqrs: boolean): Config {
        if (cqrs) {
            return {
                type: "onion",
                cqrs,
                adapterPath: "src/Presentation/Http/Adapters/",
                commandHandlerPath: "src/Application/Commands/Handler/",
                commandInputPath: "src/Application/Commands/Command/",
                controllerPath: "src/Presentation/Http/Actions/",
                database: "MySql",
                modelPath: "src/Domain/Entities/",
                repositoryInterfacePath: "src/Domain/Interfaces/Repositories/",
                repositoryPath: "src/Infrastructure/Persistence/Repositories/",
                shouldCreateQueryResult: true,
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
            repositoryInterfacePath: "/",
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
}
