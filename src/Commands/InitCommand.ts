import * as yargs from "yargs";
import file from "../Common/file";
import * as chalk from "chalk";
import { Config } from "../Common/Types/Config";
import * as path from "path";
import CreateAppFolder from "../Services/InitCommand/CreateAppFolder";
import CreateOnionFolder from "../Services/InitCommand/CreateOnionFolder";

export class InitCommand implements yargs.CommandModule {
  command = "init";
  describe = "Generates initial Base of project";

  builder(args: yargs.Argv) {
    return args
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
    const projectExist = InitCommand.checkIfExistAnyProject();

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
      InitCommand.createConfigFile("default", false);
      if (cqrs === "yes") {
        console.info(
          chalk.yellowBright("Warning! default app not support cqrs")
        );
      }
    } else {
      InitCommand.createOnionFolders(cqrs === "yes");
      InitCommand.createConfigFile("onion", cqrs === "yes");
    }

    console.info(chalk.greenBright("Bootstrapping ready! start to code!"));
  }

  private static checkIfExistAnyProject() {
    const _path = path.join(file.getCurrentDirectoryBase(), `/package.json`);

    return file.directoryExists(_path);
  }

  private static checkIfScaffoldingExist() {
    const path = `${file.getCurrentDirectoryBase()}/config.json`;

    return file.directoryExists(path);
  }

  private static createAppFolder() {
    CreateAppFolder.execute();
  }

  private static createOnionFolders(cqrs: boolean) {
    CreateOnionFolder.execute(cqrs);
  }

  private static createConfigFile(type: string, cqrs: boolean) {
    const filePath = path.join(file.getCurrentDirectoryBase(), `/config.json`);

    const content = InitCommand.getConfigContentFromType(type, cqrs);

    file.writeFile(filePath, JSON.stringify(content, undefined, 3));
  }

  private static getConfigContentFromType(type: string, cqrs: boolean): Config {
    if (cqrs) {
      return {
        type: "onion",
        cqrs,
        adapterPath: "src/Presentation/Http/Adapters/",
        commandHandlerPath:
          type === "default"
            ? "src/Application/Handlers/"
            : "src/Application/Commands/Handler/",
        commandInputPath:
          type === "default"
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
  }
}
