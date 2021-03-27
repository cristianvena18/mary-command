import * as yargs from "yargs";
import file from "../../Common/file";
import FileExistException from "../../Exceptions/FileExistException";
import { Config } from "../../Common/Types/Config";
import { getConfig } from "../../Common/Helpers/GetConfig";
import * as chalk from "chalk";

export class MakeController implements yargs.CommandModule {
  command = "make:controller";
  describe: "Creates an http controller";

  builder(args: yargs.Argv) {
    return args.option("n", {
      alias: "name",
      required: true,
      describe: "Name of controller",
    });
  }

  handler(args: yargs.Arguments) {
    const controllerName = args.name as string;

    const config = getConfig();

    const actionFilePath = MakeController.buildActionFilePath(
      controllerName,
      config
    );

    const actionClass = MakeController.buildActionClass(controllerName);

    MakeController.makeDirectory(actionFilePath);

    MakeController.fileSystemPut(actionFilePath, actionClass);
    console.info(
      chalk.greenBright(" >>> File " + actionFilePath + " was created")
    );

    MakeController.bindFile(
      actionFilePath,
      `${controllerName}Controller`,
      config
    );

    console.info(
      chalk.greenBright(" >>> File " + actionFilePath + " was binding")
    );
  }

  private static buildActionFilePath(controllerName: string, config: Config) {
    const path = `${file.getCurrentDirectoryBase()}${
      config.controllerPath
    }${controllerName}Controller.ts`;

    if (file.directoryExists(path)) {
      throw new FileExistException(path);
    }

    return path;
  }

  private static buildActionClass(action) {
    const stub = file.resource_path("/stubs/Controller.stub");

    let stubContent = file.readFile(stub);

    stubContent = stubContent.replace(/{{action}}/gi, action);

    return stubContent;
  }

  private static makeDirectory(filePath: string) {
    filePath = filePath.slice(0, filePath.lastIndexOf("/"));
    if (!file.isDirectory(filePath)) {
      file.makeDirectory(filePath);
    }
  }

  private static fileSystemPut(filePath: string, fileClass: string) {
    file.writeFile(filePath, fileClass);
  }

  private static bindFile(filePath: string, fileName: string, config: Config) {
    const { diPath } = config;

    let diPathSpliced = diPath.split("/").reverse();
    diPathSpliced = diPathSpliced.slice(1);

    let importOut = "";
    for (const a of diPathSpliced) {
      if (a !== "src") {
        importOut += "../";
      }
    }

    filePath = filePath.replace(`${file.getCurrentDirectoryBase()}`, "");
    filePath = filePath.slice(4);

    let diContent = file
      .readFile(`${file.getCurrentDirectoryBase()}${diPath}`)
      .split(/\n/);

    const newDiContent = [
      `import ${fileName} from '${importOut + filePath.replace(".ts", "")}';`,
    ];
    const containerContent = [];

    for (const content of diContent) {
      if (content.includes("import")) {
        newDiContent.push(content);
      } else {
        containerContent.push(content);
      }
    }

    for (const content of containerContent) {
      if (content.includes("//Actions")) {
        newDiContent.push(content);
        newDiContent.push(`DIContainer.bind(${fileName}).toSelf();`);
        continue;
      }

      newDiContent.push(content);
    }
    file.writeFile(diPath, newDiContent);
  }
}
