import file from "../../Common/file";

export default class Common {
  protected static copyPresentationExceptions(path: string) {
    const exceptions = [
      "AuthenticationException",
      "AuthorizationException",
      "BadRequestException",
      "BaseHttpException",
      "ForeignKeyConstraintException",
      "InternalErrorException",
      "NotFoundException",
      "UnprocessableEntityException",
    ];

    for (const exception of exceptions) {
      file.writeFile(
        `${path}/${exception}.ts`,
        file.readFile(file.resource_path(`/stubs/Exceptions/${exception}.stub`))
      );
    }
  }

  protected static copyApplicationExceptions(path: string) {
    const exceptions = [
      "EntityNotFoundException",
      "ValidationException",
      "AuthenticationFailed",
      "AuthorizationFailed",
      "CannotPasswordMatch",
      "ApplicationException",
      "ForeignKeyConstraintFailed",
      "RelatedEntitiesConstraintFailed",
      "EmailAlreadyExist",
    ];

    for (const exception of exceptions) {
      file.writeFile(
        `${path}/${exception}.ts`,
        file.readFile(file.resource_path(`/stubs/Exceptions/${exception}.stub`))
      );
    }
  }
}
