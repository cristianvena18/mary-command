import * as yargs from "yargs";
import file from "../../Common/file";
import FileExistException from "../../Exceptions/FileExistException";
import { getConfig } from "../../Common/Helpers/GetConfig";
import { Config } from "../../Common/Types/Config";

export class MakeUseCase implements yargs.CommandModule {
  command = "make:usecase";

  describe: "Creates an use case classes";

  builder(args: yargs.Argv) {
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
  }

  handler(args: yargs.Arguments) {
    const useCaseName: string = args.name as any;
    const useCaseType: string = args.type as any;
    const grouping: string = args.grouping as any;
    const attributes: string = args.parameters as any;

    const config = getConfig();
    const isCommand = useCaseType === "c";

    const actionFilePath = MakeUseCase.buildActionFilePath(
      useCaseName,
      grouping,
      config
    );
    const adapterFilePath = MakeUseCase.buildAdapterFilePath(
      useCaseName,
      grouping,
      config
    );
    const inputFilePath = MakeUseCase.buildInputFilePath(
      useCaseName,
      grouping,
      isCommand,
      config
    );
    const handlerFilePath = MakeUseCase.buildHandlerFilePath(
      useCaseName,
      grouping,
      isCommand,
      config
    );
    const resultFilePath =
      isCommand === false && config.shouldCreateQueryResult
        ? MakeUseCase.buildResultFilePath(useCaseName, grouping, config)
        : null;

    console.info("\n1. File paths was built!\n");

    const actionClass = MakeUseCase.buildActionClass(
      useCaseName,
      grouping,
      isCommand
    );
    const adapterClass = MakeUseCase.buildAdapterClass(
      useCaseName,
      grouping,
      isCommand
    );
    const inputClass = MakeUseCase.buildInputClass(
      useCaseName,
      grouping,
      attributes,
      isCommand
    );
    const handlerClass = MakeUseCase.buildHandlerClass(
      useCaseName,
      grouping,
      isCommand
    );
    const resultClass =
      isCommand === false
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

    MakeUseCase.bindFile(
      actionFilePath,
      `${useCaseName}${grouping}Action`,
      config
    );
    MakeUseCase.bindFile(
      adapterFilePath,
      `${useCaseName}${grouping}Adapter`,
      config
    );
    MakeUseCase.bindFile(
      handlerFilePath,
      `${useCaseName}${grouping}Handler`,
      config
    );
    if (!isCommand && config.shouldCreateQueryResult) {
      MakeUseCase.bindFile(
        resultFilePath,
        `${useCaseName}${grouping}Result`,
        config
      );
    }
    console.info("5. Classes was binding!\n");
  }

  private static buildActionFilePath(action, grouping, config: Config) {
    const path = `${file.getCurrentDirectoryBase()}${
      config.controllerPath
    }${grouping}/${action}Action.ts`;

    if (file.directoryExists(path)) {
      throw new FileExistException(path);
    }

    return path;
  }

  private static buildAdapterFilePath(action, grouping, config: Config) {
    const path = `${file.getCurrentDirectoryBase()}${
      config.adapterPath
    }${grouping}/${action}Adapter.ts`;

    if (file.directoryExists(path)) {
      throw new FileExistException(path);
    }

    return path;
  }

  private static buildInputFilePath(
    action,
    grouping,
    isCommand,
    config: Config
  ) {
    let path = "";
    if (isCommand) {
      path = `${file.getCurrentDirectoryBase()}${
        config.commandInputPath
      }${grouping}/${action}Command.ts`;
    } else {
      path = `${file.getCurrentDirectoryBase()}${
        config.queryInputPath ?? config.commandInputPath
      }${grouping}/${action}Query.ts`;
    }

    if (file.directoryExists(path)) {
      throw new FileExistException(path);
    }

    return path;
  }

  private static buildHandlerFilePath(
    action,
    grouping,
    isCommand,
    config: Config
  ) {
    let path = "";
    if (isCommand) {
      path = `${file.getCurrentDirectoryBase()}${
        config.commandHandlerPath
      }${grouping}/${action}Handler.ts`;
    } else {
      path = `${file.getCurrentDirectoryBase()}${
        config.queryHandlerPath ?? config.commandHandlerPath
      }${grouping}/${action}Handler.ts`;
    }

    if (file.directoryExists(path)) {
      throw new FileExistException(path);
    }

    return path;
  }

  private static buildResultFilePath(action, grouping, config: Config) {
    const path = `${file.getCurrentDirectoryBase()}${
      config.resultFilePath
    }${grouping}/${action}Result.ts`;

    if (file.directoryExists(path)) {
      throw new FileExistException(path);
    }

    return path;
  }

  private static buildActionClass(action, grouping, isCommand) {
    const stub = isCommand
      ? file.resource_path("/stubs/ActionForCommand.stub")
      : file.resource_path("/stubs/ActionForQuery.stub");

    let stubContent = file.readFile(stub);

    stubContent = stubContent.replace(/{{action}}/gi, action);
    stubContent = stubContent.replace(/{{grouping}}/gi, grouping);

    return stubContent;
  }

  private static buildAdapterClass(action, grouping, isCommand) {
    const stub = isCommand
      ? file.resource_path("/stubs/CommandHttpAdapter.stub")
      : file.resource_path("/stubs/QueryHttpAdapter.stub");

    let stubContent = file.readFile(stub);

    stubContent = stubContent.replace(/{{action}}/gi, action);
    stubContent = stubContent.replace(/{{grouping}}/gi, grouping);

    return stubContent;
  }

  private static buildInputClass(action, grouping, attributes, isCommand) {
    attributes = attributes.trim();
    attributes = attributes.split(",");

    let classAttributes = "";

    let constructorParameters = "";
    let constructorAssignment = "";

    let getMethods = "";

    for (const attribute of attributes) {
      let name = attribute.split("-")[0];
      let type = attribute.split("-")[1];

      classAttributes += `    private ${name} ${
        MakeUseCase.isNullable(type) ? "?:" : ":"
      } ${MakeUseCase.isNullable(type) ? type.slice(1) : type}; \n`;

      constructorParameters += `        ${name}${
        MakeUseCase.isNullable(type) ? "?:" : ":"
      } ${MakeUseCase.isNullable(type) ? type.slice(1) : type} ${
        MakeUseCase.isLastElement(attribute, attributes) ? "" : ",\n"
      }`;
      constructorAssignment += `        this.${name} = ${name}${
        MakeUseCase.isLastElement(attribute, attributes) ? ";" : ";\n"
      }`;

      getMethods += MakeUseCase.isFirstElement(attribute, attributes)
        ? "\n"
        : "\n\n";
      getMethods += `    public get${
        name.charAt(0).toUpperCase() + name.slice(1)
      }(): ${MakeUseCase.isNullable(type) ? type.slice(1) : type} \n`;
      getMethods += `    {\n`;
      getMethods += `        return this.${name};\n`;
      getMethods += `    }`;
    }

    const stub = isCommand
      ? file.resource_path("/stubs/Command.stub")
      : file.resource_path("/stubs/Query.stub");

    let stubContent = file.readFile(stub);

    stubContent = stubContent.replace(/{{grouping}}/gi, grouping);
    stubContent = stubContent.replace(/{{action}}/gi, action);
    stubContent = stubContent.replace(
      /{{class_attributes}}/gi,
      classAttributes
    );
    stubContent = stubContent.replace(
      /{{constructor_parameters}}/gi,
      constructorParameters
    );
    stubContent = stubContent.replace(
      /{{constructor_assignments}}/gi,
      constructorAssignment
    );
    stubContent = stubContent.replace(/{{get_methods}}/gi, getMethods);

    return stubContent;
  }

  private static buildHandlerClass(action, grouping, isCommand) {
    const stub = isCommand
      ? file.resource_path("/stubs/CommandHandler.stub")
      : file.resource_path("/stubs/QueryHandler.stub");

    let stubContent = file.readFile(stub);

    stubContent = stubContent.replace(/{{action}}/gi, action);
    stubContent = stubContent.replace(/{{grouping}}/gi, grouping);

    return stubContent;
  }

  private static buildResultClass(action, grouping) {
    const stub = file.resource_path("/stubs/QueryResult.stub");

    let stubContent = file.readFile(stub);

    stubContent = stubContent.replace(/{{action}}/gi, action);
    stubContent = stubContent.replace(/{{grouping}}/gi, grouping);

    return stubContent;
  }

  private static isNullable(type) {
    return type.includes("?");
  }

  private static isLastElement(index, attributes) {
    return attributes[attributes.length - 1] === index;
  }

  private static isFirstElement(index, attributes) {
    return attributes[0] === index;
  }

  private static makeDirectory(filePath) {
    filePath = filePath.slice(0, filePath.lastIndexOf("/"));
    if (!file.isDirectory(filePath)) {
      file.makeDirectory(filePath);
    }
  }

  private static fileSystemPut(filePath, fileClass) {
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
      if (fileName.includes("Action") && content.includes("//Actions")) {
        newDiContent.push(content);
        newDiContent.push(`DIContainer.bind(${fileName}).toSelf();`);
        continue;
      }
      if (fileName.includes("Adapter") && content.includes("//Adapters")) {
        newDiContent.push(content);
        newDiContent.push(`DIContainer.bind(${fileName}).toSelf();`);
        continue;
      }
      if (fileName.includes("Handler") && content.includes("//Handlers")) {
        newDiContent.push(content);
        newDiContent.push(`DIContainer.bind(${fileName}).toSelf();`);
        continue;
      }

      newDiContent.push(content);
    }
    file.writeFile(diPath, newDiContent);
  }
}
