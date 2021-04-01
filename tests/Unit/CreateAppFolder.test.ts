import file from "../../src/Common/file";
import CreateAppFolder from "../../src/Services/InitCommand/CreateAppFolder";

describe("Create Default Application", () => {
  beforeAll(() => {
    file.makeDirectory = jest.fn();
    file.writeFile = jest.fn();
    file.getCurrentDirectoryBase = jest.fn().mockImplementation(() => {
      return "/path/to/directory";
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("it should call makeDirectory with App folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App`
    );
  });

  test("it should call makeDirectory with Controllers folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Http/Controllers`
    );
  });

  test("it should call makeDirectory with Middlewares folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Http/Middlewares`
    );
  });

  test("it should call makeDirectory with services folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Services`
    );
  });

  test("it should call makeDirectory with validation service folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Validation`
    );
  });

  test("it should create a JoiValidationService file", () => {
    file.readFile = jest.fn().mockImplementation(() => {
      return "JoiValidationService content";
    });

    CreateAppFolder.execute();

    expect(file.writeFile).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/JoiValidationService.ts`,
      "JoiValidationService content"
    );
  });

  test("it should create a ValidationService file", () => {
    file.readFile = jest.fn().mockImplementation(() => {
      return "ValidationService content";
    });

    CreateAppFolder.execute();

    expect(file.writeFile).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/ValidationService.ts`,
      "ValidationService content"
    );
  });

  test("it should create a BaseErrorSchema file", () => {
    file.readFile = jest.fn().mockImplementation(() => {
      return "BaseErrorSchema content";
    });

    CreateAppFolder.execute();

    expect(file.writeFile).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/BaseErrorSchema.ts`,
      "BaseErrorSchema content"
    );
  });

  test("it should create a ErrorMessages file", () => {
    file.readFile = jest.fn().mockImplementation(() => {
      return "ErrorMessages content";
    });

    CreateAppFolder.execute();

    expect(file.writeFile).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/ErrorMessages.ts`,
      "ErrorMessages content"
    );
  });

  test("it should call makeDirectory with Logger service folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Logger`
    );
  });

  test("it should create a winstonLoggerService", () => {
    file.readFile = jest.fn().mockImplementation(() => {
      return "WinstonLoggerService content {{log_levels_path}}, {{interface_path}}";
    });

    CreateAppFolder.execute();

    expect(file.writeFile).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Logger/WinstonLoggerService.ts`,
      "WinstonLoggerService content ../../Enums/LogLevels, ./LoggerService"
    );
  });

  test("it should create a LoggerService interface", () => {
    file.readFile = jest.fn().mockImplementation(() => {
      return "LoggerService content {{log_levels_path}}";
    });

    CreateAppFolder.execute();

    expect(file.writeFile).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Logger/LoggerService.ts`,
      "LoggerService content ../../Enums/LogLevels"
    );
  });

  test("it should create a Repositories folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Repositories`
    );
  });

  test("it should create a TypeRepository class", () => {
    file.readFile = jest.fn().mockImplementation(() => {
      return "TypeRepository content";
    });

    CreateAppFolder.execute();

    expect(file.writeFile).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Repositories/TypeRepository.ts`,
      "TypeRepository content"
    );
  });

  test("it should create a exceptions folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Exceptions`
    );
  });

  test("it should create a Enums folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Enums`
    );
  });

  test("it should create a models folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Models`
    );
  });

  test("it should create a migrations folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/database/migrations`
    );
  });

  test("it should create a config database folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/database/Config`
    );
  });

  test("it should create a config folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/config`
    );
  });

  test("it should create a DI folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/DI`
    );
  });

  test("it should create a Debug folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App/Debug`
    );
  });

  test("it should create a routes folder", () => {
    CreateAppFolder.execute();

    expect(file.makeDirectory).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/routes`
    );
  });

  test("it should create a App file", () => {
    file.readFile = jest.fn().mockImplementation(() => {
      return "App content";
    });

    CreateAppFolder.execute();

    expect(file.writeFile).toBeCalledWith(
      `${file.getCurrentDirectoryBase()}/src/App.ts`,
      "App content"
    );
  });
});
