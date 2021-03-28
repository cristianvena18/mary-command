import Common from "./Common";
import file from "../../Common/file";
import { GetCommonTemplates } from "../../Common/Helpers/GetCommonTemplates";

class CreateOnionFolder extends Common {
  public static execute(cqrs: boolean) {
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
    this.copyPresentationExceptions(
      `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Exceptions`
    );

    file.makeDirectory(
      `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Routes`
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Routes/index.ts`,
      file.readFile(file.resource_path("/stubs/Utils/Router.stub"))
    );

    file.makeDirectory(
      `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Middlewares`
    );

    file.makeDirectory(
      `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Enums`
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Enums/HttpCodes.ts`,
      file.readFile(file.resource_path("/stubs/Utils/HttpCodes.stub"))
    );
    file.makeDirectory(
      `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Utils`
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Utils/JoiValidationService.ts`,
      file.readFile(
        file.resource_path("/stubs/Utils/JoiValidationService.stub")
      )
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Utils/ValidationService.ts`,
      file.readFile(file.resource_path("/stubs/Utils/ValidationService.stub"))
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Utils/BaseErrorSchema.ts`,
      file.readFile(file.resource_path("/stubs/Utils/BaseErrorSchema.stub"))
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Presentation/Http/Validations/Utils/ErrorMessages.ts`,
      file.readFile(file.resource_path("/stubs/Utils/ErrorMessages.stub"))
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

    file.makeDirectory(
      `${file.getCurrentDirectoryBase()}/src/Application/Exceptions`
    );

    this.copyApplicationExceptions(
      `${file.getCurrentDirectoryBase()}/src/Application/Exceptions`
    );

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
    let loggerInterfaceStub = file.readFile(
      file.resource_path("/stubs/Utils/LoggerService.stub")
    );
    loggerInterfaceStub = loggerInterfaceStub.replace(
      /{{log_levels_path}}/gi,
      "../../Enums/LogLevels"
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Domain/Interfaces/Services/LoggerService.ts`,
      loggerInterfaceStub
    );

    file.makeDirectory(`${file.getCurrentDirectoryBase()}/src/Domain/Enums`);

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Domain/Enums/LogLevels.ts`,
      file.readFile(file.resource_path("/stubs/Utils/LogLevels.stub"))
    );

    /**
     * Infrastructure dependencies
     */
    file.makeDirectory(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Repositories`
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Repositories/TypeRepository.ts`,
      file.readFile(file.resource_path("/stubs/Utils/TypeRepository.stub"))
    );

    let loggerStub = file.readFile(
      file.resource_path("/stubs/Utils/WinstonLoggerService.stub")
    );
    loggerStub = loggerStub.replace(
      /{{interface_path}}/gi,
      "../../../Domain/Interfaces/Services/LoggerService"
    );
    loggerStub = loggerStub.replace(
      /{{log_levels_path}}/gi,
      "../../../Domain/Enums/LogLevels"
    );

    file.makeDirectory(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Logger/Providers`
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Logger/Providers/WinstonLoggerService.ts`,
      loggerStub
    );

    file.makeDirectory(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Migrations`
    );
    file.makeDirectory(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Config`
    );
    let databaseConnectionStub = file.readFile(
      file.resource_path("/stubs/Utils/DatabaseConnection.stub")
    );
    databaseConnectionStub = databaseConnectionStub.replace(
      /{{config_path}}/gi,
      "../../Config/mode"
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/DatabaseConnection.ts`,
      databaseConnectionStub
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Config/ProductionConfig.ts`,
      file.readFile(
        file.resource_path("/stubs/Utils/DatabaseProductionConfig.stub")
      )
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Config/DevelopmentConfig.ts`,
      file.readFile(
        file.resource_path("/stubs/Utils/DatabaseDevelopmentConfig.stub")
      )
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Config/TestingConfig.ts`,
      file.readFile(
        file.resource_path("/stubs/Utils/DatabaseTestingConfig.stub")
      )
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Persistence/Config/ConfigVariables.ts`,
      file.readFile(
        file.resource_path("/stubs/Utils/DatabaseCommonConfig.stub")
      )
    );

    file.makeDirectory(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/DI`
    );
    let diStub = file.readFile(
      file.resource_path("/stubs/Utils/di.config.stub")
    );
    diStub = diStub.replace(
      /{{router_path}}/gi,
      "../../Presentation/Http/Routes"
    );
    diStub = diStub.replace(
      /{{validation_interface_path}}/gi,
      "../../Presentation/Http/Validations/Utils/ValidationService"
    );
    diStub = diStub.replace(
      /{{logger_interface_path}}/gi,
      "../../Domain/Interfaces/Services/LoggerService"
    );
    diStub = diStub.replace(
      /{{validation_service_path}}/gi,
      "../../Presentation/Http/Validations/Utils/JoiValidationService"
    );
    diStub = diStub.replace(
      /{{logger_service_path}}/gi,
      "../../Infrastructure/Logger/Providers/WinstonLoggerService"
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/DI/di.config.ts`,
      diStub
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/DI/interfaces.types.ts`,
      file.readFile(file.resource_path("/stubs/Utils/interfaces.types.stub"))
    );

    let errorHandlerStub = file.readFile(
      file.resource_path("/stubs/Utils/ErrorHandler.stub")
    );
    errorHandlerStub = errorHandlerStub.replace(
      /{{application_exceptions_path}}/gi,
      "../../Application/Exceptions"
    );
    errorHandlerStub = errorHandlerStub.replace(
      /{{presentation_exceptions_path}}/gi,
      "../../Presentation/Http/Exceptions"
    );
    errorHandlerStub = errorHandlerStub.replace(/{{di_path}}/gi, "../DI");
    errorHandlerStub = errorHandlerStub.replace(
      /{{http_codes_path}}/gi,
      "../../Presentation/Http/Enums"
    );
    errorHandlerStub = errorHandlerStub.replace(
      /{{log_levels_path}}/gi,
      "../../Domain/Enums/LogLevels"
    );
    errorHandlerStub = errorHandlerStub.replace(
      /{{services_path}}/gi,
      "../../Domain/Interfaces/Services"
    );
    errorHandlerStub = errorHandlerStub.replace(
      /{{error_messages_path}}/gi,
      "../../Presentation/Http/Validations/Utils"
    );

    file.makeDirectory(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Debug`
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Debug/ErrorHandler.ts`,
      errorHandlerStub
    );
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Infrastructure/Debug/customResponse.ts`,
      file.readFile(file.resource_path("/stubs/Utils/customResponse.stub"))
    );
    file.makeDirectory(`${file.getCurrentDirectoryBase()}/src/Config`);
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/Config/mode.ts`,
      file.readFile(file.resource_path("/stubs/Utils/ConfigModes.stub"))
    );

    /**
     * Root dependencies
     */
    file.writeFile(
      `${file.getCurrentDirectoryBase()}/tsconfig.json`,
      GetCommonTemplates.getTsConfigTemplate()
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/.env`,
      GetCommonTemplates.getEnvironmentFile()
    );
    let serverStub = file.readFile(
      file.resource_path("/stubs/Utils/server.stub")
    );
    serverStub = serverStub.replace(
      /{{di_path}}/gi,
      "Infrastructure/DI/di.config"
    );

    file.writeFile(
      `${file.getCurrentDirectoryBase()}/src/server.ts`,
      serverStub
    );
    let appStub = file.readFile(file.resource_path("/stubs/Utils/App.stub"));
    appStub = appStub.replace(
      /{{database_connection_path}}/gi,
      "Infrastructure/Persistence/DatabaseConnection"
    );
    appStub = appStub.replace(
      /{{error_handler_path}}/gi,
      "Infrastructure/Debug/ErrorHandler"
    );
    appStub = appStub.replace(/{{routes_path}}/gi, "Presentation/Http/Routes");
    appStub = appStub.replace(/{{di_path}}/gi, "Infrastructure/DI/di.config");

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

export default CreateOnionFolder;
