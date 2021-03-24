import * as yargs from "yargs";
import file from "../../Common/file";
import FileExistException from "../../Exceptions/FileExistException";
import { Config } from "../../Common/Types/Config";
import { getConfig } from "../../Common/Helpers/GetConfig";

export class MakeRepository implements yargs.CommandModule {
  command = "make:repository";
  describe = "Creates a repository by a entity";

  builder(args: yargs.Argv) {
    return args.option("n", {
      alias: "name",
      describe: "Name of repository",
      required: true,
    });
  }

  handler(args: yargs.Arguments) {
    const repositoryName = args.name as string;
    const config = getConfig();
    let interfaceFilePath;
    let interfaceClass;
    if (config.shouldCreateRepositoryInterface) {
      interfaceFilePath = MakeRepository.buildInterfaceFilePath(
        repositoryName,
        config
      );

      interfaceClass = MakeRepository.buildInterfaceClass(repositoryName);

      MakeRepository.makeDirectory(interfaceFilePath);
      MakeRepository.fileSystemPut(interfaceFilePath, interfaceClass);
    }

    const actionFilePath = MakeRepository.buildImplementationFilePath(
      repositoryName,
      config
    );

    const actionClass = MakeRepository.buildActionClass(repositoryName, config);

    MakeRepository.makeDirectory(actionFilePath);

    MakeRepository.fileSystemPut(actionFilePath, actionClass);
    console.info(" >>> File " + actionFilePath + " was created");

    MakeRepository.bindFile(
      actionFilePath,
      `${config.database}${repositoryName}Repository`,
      interfaceFilePath,
      `${repositoryName}Repository`,
      config
    );
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

  private static buildInterfaceFilePath(
    repositoryName: string,
    config: Config
  ) {
    if (!config.shouldCreateRepositoryInterface) {
      return;
    }

    const path = `${file.getCurrentDirectoryBase()}${
      config.repositoryInterfacePath
    }${repositoryName}Repository.ts`;

    if (file.directoryExists(path)) {
      throw new FileExistException(path);
    }

    return path;
  }

  private static buildImplementationFilePath(
    repositoryName: string,
    config: Config
  ) {
    const path = `${file.getCurrentDirectoryBase()}${config.repositoryPath}${
      config.database
    }${repositoryName}Repository.ts`;

    if (file.directoryExists(path)) {
      throw new FileExistException(path);
    }

    return path;
  }

  private static buildInterfaceClass(name: string) {
    const stub = file.resource_path("/stubs/RepositoryInterface.stub");

    let stubContent = file.readFile(stub);

    stubContent = stubContent
      .replace(/{{name}}/gi, name.toLowerCase())
      .replace(/{{type}}/gi, name);

    return stubContent;
  }

  private static buildActionClass(name: string, config: Config) {
    const stub = file.resource_path("/stubs/Repository.stub");

    let stubContent = file.readFile(stub);

    const interfacePath = config.shouldCreateRepositoryInterface
      ? `import { ${name}Repository } from '../../../../Domain/Interfaces/Repositories/${name}Repository.ts'`
      : "";

    const _interface = config.shouldCreateRepositoryInterface
      ? `implements ${name}Repository`
      : "";

    stubContent = stubContent
      .replace(/{{name}}/gi, name.toLowerCase())
      .replace(/{{type}}/gi, name)
      .replace(/{{interface_path}}/gi, interfacePath)
      .replace(/{{interface}}/gi, _interface)
      .replace(/{{database}}/gi, config.database);

    return stubContent;
  }

  private static bindFile(
    filePath: string,
    fileName: string,
    interfacePath: string,
    interfaceName: string,
    config: Config
  ) {
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

    if (interfacePath) {
      interfacePath = interfacePath.replace(
        `${file.getCurrentDirectoryBase()}`,
        ""
      );
      interfacePath = interfacePath.slice(4);
    }

    let diContent = file
      .readFile(`${file.getCurrentDirectoryBase()}${diPath}`)
      .split(/\n/);

    if (interfacePath) {
      let interfacesContent = file
        .readFile(
          `${file.getCurrentDirectoryBase()}${diPath.replace(
            "di.config.ts",
            "interfaces.types.ts"
          )}`
        )
        .split(/\n/);

      const newContent = [];

      for (const content of interfacesContent) {
        if (content.includes("//Symbols")) {
          newContent.push(content);
          newContent.push(`${interfaceName}: Symbol.for("${interfaceName}"),`);
        } else {
          newContent.push(content);
        }
      }

      file.writeFile(
        `${file.getCurrentDirectoryBase()}${diPath.replace(
          "di.config.ts",
          "interfaces.types.ts"
        )}`,
        newContent
      );
    }

    const newDiContent = [
      `import ${fileName} from '${importOut + filePath.replace(".ts", "")}';`,
    ];
    if (interfacePath) {
      newDiContent.push(
        `import { ${interfaceName} } from '${
          importOut + interfacePath.replace(".ts", "")
        }';`
      );
    }

    const containerContent = [];

    for (const content of diContent) {
      if (content.includes("import")) {
        newDiContent.push(content);
      } else {
        containerContent.push(content);
      }
    }

    for (const content of containerContent) {
      if (content.includes("//Repositories")) {
        newDiContent.push(content);
        if (interfacePath) {
          newDiContent.push(
            `DIContainer.bind<${interfaceName}>(INTERFACES.${interfaceName}).to(${fileName});`
          );
        } else {
          newDiContent.push(`DIContainer.bind(${fileName}).toSelf();`);
        }
        continue;
      }

      newDiContent.push(content);
    }
    file.writeFile(diPath, newDiContent);
  }
}
