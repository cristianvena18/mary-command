import { InitCommand } from "../../src/Commands/InitCommand";
import * as chalk from "chalk";
import file from "../../src/Common/file";

describe("Init Commands tests", () => {
  beforeAll(() => {
    file.makeDirectory = jest.fn();
    file.writeFile = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should show a warning when user try create a default with cqrs", () => {
    const handler = new InitCommand();
    console.info = jest.fn();
    file.directoryExists = jest.fn().mockImplementationOnce(() => {
      return false;
    });

    handler.handler({ $0: "", _: undefined, cqrs: "yes", type: "default" });

    expect(console.info).toBeCalledWith(
      chalk.yellowBright("Warning! default app not support cqrs")
    );
  });

  test("it should exit because there is an application installed", () => {
    const handler = new InitCommand();
    const mockExit = jest
      .spyOn(process, "exit")
      // @ts-ignore
      .mockImplementation(() => {});
    console.error = jest.fn();

    file.directoryExists = jest.fn().mockImplementation(() => {
      return true;
    });

    handler.handler({ $0: "", _: undefined, cqrs: "yes", type: "default" });

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith(
      "Error: scaffolding has been exist"
    );
  });
});
