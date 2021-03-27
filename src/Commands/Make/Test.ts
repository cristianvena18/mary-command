import * as yargs from "yargs";
import file from "../../Common/file";
import FileExistException from "../../Exceptions/FileExistException";
import * as chalk from "chalk";

export class MakeTest implements yargs.CommandModule {
  command = "make:test";
  describe = "Make an test";

  builder(args: yargs.Argv) {
    return args
      .option("n", { alias: "name", describe: "Name of test", required: true })
      .option("t", {
        alias: "type",
        default: "feature",
        describe: "Type of test",
      });
  }

  handler(args: yargs.Arguments) {
    const testName = args.name as string;
    const type = args.type as string;

    const actionFilePath = MakeTest.buildTestFilePath(testName, type);

    const actionClass = MakeTest.buildTestClass(testName, type);

    MakeTest.makeDirectory(actionFilePath);

    MakeTest.fileSystemPut(actionFilePath, actionClass);
    console.info(
      chalk.greenBright(" >>> Test " + actionFilePath + " was created")
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

  private static buildTestFilePath(testName: string, type: string) {
    const path = `${file.getCurrentDirectoryBase()}tests/${
      type === "feature" ? "Featured" : "Unit"
    }/${testName}Test.ts`;

    if (file.directoryExists(path)) {
      throw new FileExistException(path);
    }

    return path;
  }

  private static buildTestClass(action: string, type: string) {
    let stub;
    if (type === "feature") {
      stub = file.resource_path("/stubs/FeaturedTest.stub");
    } else {
      stub = file.resource_path("/stubs/UnitTest.stub");
    }

    let stubContent = file.readFile(stub);

    stubContent = stubContent.replace(/{{action}}/gi, action);

    return stubContent;
  }
}
