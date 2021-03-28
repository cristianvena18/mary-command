import file from "../../Common/file";
const path = require("path");
import { GetCommonTemplates } from "../../Common/Helpers/GetCommonTemplates";
import Common from "./Common";

class CreateAppFolder extends Common {
  public static execute() {
    file.makeDirectory(path.join(file.getCurrentDirectoryBase(), "/src/App"));

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), `/src/App/Http/Controllers`)
    );

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), `/src/App/Http/Middlewares`)
    );

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), `/src/App/Services`)
    );

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), "src/App/Services/Validation")
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/JoiValidationService.ts`,
      file.readFile(
        file.resource_path("/stubs/Utils/JoiValidationService.stub")
      )
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/ValidationService.ts`,
      file.readFile(file.resource_path("/stubs/Utils/ValidationService.stub"))
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/BaseErrorSchema.ts`,
      file.readFile(file.resource_path("/stubs/Utils/BaseErrorSchema.stub"))
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Validation/ErrorMessages.ts`,
      file.readFile(file.resource_path("/stubs/Utils/ErrorMessages.stub"))
    );

    let loggerStub = file.readFile(
      file.resource_path("/stubs/Utils/WinstonLoggerService.stub")
    );
    loggerStub = loggerStub.replace(/{{interface_path}}/gi, "./LoggerService");
    loggerStub = loggerStub.replace(
      /{{log_levels_path}}/gi,
      "../../Enums/LogLevels"
    );

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), "src/App/Services/Logger")
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Logger/WinstonLoggerService.ts`,
      loggerStub
    );
    let loggerInterfaceStub = file.readFile(
      file.resource_path(`/stubs/Utils/LoggerService.stub`)
    );
    loggerInterfaceStub = loggerInterfaceStub.replace(
      /{{log_levels_path}}/gi,
      "../../Enums/LogLevels"
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/Services/Logger/LoggerService.ts`,
      loggerInterfaceStub
    );

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), `/src/App/Repositories`)
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/Repositories/TypeRepository.ts`,
      file.readFile(file.resource_path("/stubs/Utils/TypeRepository.stub"))
    );

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), `/src/App/Exceptions`)
    );

    CreateAppFolder.copyApplicationExceptions(
      `${file.getCurrentDirectoryBase()}/src/App/Exceptions`
    );
    CreateAppFolder.copyPresentationExceptions(
      `${file.getCurrentDirectoryBase()}/src/App/Exceptions`
    );

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), `/src/App/Enums`)
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/Enums/HttpCodes.ts`,
      file.readFile(file.resource_path("/stubs/Utils/HttpCodes.stub"))
    );
    file.makeDirectory(`${file.getCurrentDirectoryBase()}/src/App/Enums`);
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/Enums/LogLevels.ts`,
      file.readFile(file.resource_path("/stubs/Utils/LogLevels.stub"))
    );

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), `/src/App/Models`)
    );

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), `/src/database/migrations`)
    );

    let databaseConnectionStub = file.readFile(
      file.resource_path("/stubs/Utils/DatabaseConnection.stub")
    );

    databaseConnectionStub = databaseConnectionStub.replace(
      /{{config_path}}/gi,
      "../config/mode"
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/database/DatabaseConnection.ts`,
      databaseConnectionStub
    );

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), "src/database/Config")
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/database/Config/ProductionConfig.ts`,
      file.readFile(
        file.resource_path("/stubs/Utils/DatabaseProductionConfig.stub")
      )
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/database/Config/DevelopmentConfig.ts`,
      file.readFile(
        file.resource_path("/stubs/Utils/DatabaseDevelopmentConfig.stub")
      )
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/database/Config/TestingConfig.ts`,
      file.readFile(
        file.resource_path("/stubs/Utils/DatabaseTestingConfig.stub")
      )
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/database/Config/ConfigVariables.ts`,
      file.readFile(
        file.resource_path("/stubs/Utils/DatabaseCommonConfig.stub")
      )
    );

    file.makeDirectory(path.join(file.getCurrentDirectoryBase(), "src/config"));
    file.writeFile(
      path.join(file.getCurrentDirectoryBase(), "src/config/mode.ts"),
      file.readFile(file.resource_path("/stubs/Utils/ConfigModes.stub"))
    );

    file.makeDirectory(`${file.getCurrentDirectoryBase()}/src/App/DI`);
    let diStub = file.readFile(
      file.resource_path("/stubs/Utils/di.config.stub")
    );
    diStub = diStub.replace(/{{router_path}}/gi, "../../routes");
    diStub = diStub.replace(
      /{{validation_interface_path}}/gi,
      "../Services/Validation/ValidationService"
    );
    diStub = diStub.replace(
      /{{logger_interface_path}}/gi,
      "../Services/Logger/LoggerService"
    );
    diStub = diStub.replace(
      /{{validation_service_path}}/gi,
      "../Services/Validation/JoiValidationService"
    );
    diStub = diStub.replace(
      /{{logger_service_path}}/gi,
      "../Services/Logger/WinstonLoggerService"
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/DI/di.config.ts`,
      diStub
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/DI/interfaces.types.ts`,
      file.readFile(file.resource_path("/stubs/Utils/interfaces.types.stub"))
    );
    file.makeDirectory(`${file.getCurrentDirectoryBase()}/src/App/Debug`);
    let errorHandlerStub = file.readFile(
      file.resource_path("/stubs/Utils/ErrorHandler.stub")
    );
    errorHandlerStub = errorHandlerStub.replace(
      /{{application_exceptions_path}}/gi,
      "../Exceptions"
    );
    errorHandlerStub = errorHandlerStub.replace(
      /{{presentation_exceptions_path}}/gi,
      "../Exceptions"
    );
    errorHandlerStub = errorHandlerStub.replace(/{{di_path}}/gi, "../DI");
    errorHandlerStub = errorHandlerStub.replace(
      /{{log_levels_path}}/gi,
      "../Enums/LogLevels"
    );
    errorHandlerStub = errorHandlerStub.replace(
      /{{services_path}}/gi,
      "../Services/Logger"
    );
    errorHandlerStub = errorHandlerStub.replace(
      /{{error_messages_path}}/gi,
      "../Services/Validation/"
    );
    errorHandlerStub = errorHandlerStub.replace(
      /{{http_codes_path}}/gi,
      "../Enums"
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/Debug/ErrorHandler.ts`,
      errorHandlerStub
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/App/Debug/customResponse.ts`,
      file.readFile(file.resource_path("/stubs/Utils/customResponse.stub"))
    );

    file.makeDirectory(
      path.join(file.getCurrentDirectoryBase(), `/src/routes`)
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/routes/index.ts`,
      file.readFile(file.resource_path("/stubs/Utils/Router.stub"))
    );

    file.writeFile(
      path.join(file.getCurrentDirectoryBase(), `/tsconfig.json`),
      GetCommonTemplates.getTsConfigTemplate()
    );

    file.writeFile(
      path.join(file.getCurrentDirectoryBase(), `/.env`),
      GetCommonTemplates.getEnvironmentFile()
    );
    let serverStub = file.readFile(
      file.resource_path("/stubs/Utils/server.stub")
    );
    serverStub = serverStub.replace(/{{di_path}}/gi, "App/DI/di.config");

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/server.ts`,
      serverStub
    );

    let appStub = file.readFile(file.resource_path("/stubs/Utils/App.stub"));
    appStub = appStub.replace(
      /{{database_connection_path}}/gi,
      "database/DatabaseConnection"
    );
    appStub = appStub.replace(
      /{{error_handler_path}}/gi,
      "App/Debug/ErrorHandler"
    );
    appStub = appStub.replace(/{{di_path}}/gi, "App/DI/di.config");
    appStub = appStub.replace(/{{routes_path}}/gi, "routes");

    file.writeFile(`${file.getCurrentDirectoryBase()}/src/App.ts`, appStub);
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/package.json`,
      GetCommonTemplates.getNodePackageTemplate()
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/.gitignore`,
      GetCommonTemplates.getGitIgnoreFile()
    );
  }
}

export default CreateAppFolder;
