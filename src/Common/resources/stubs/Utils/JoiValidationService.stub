import { ValidationService } from "./ValidationService";
import { injectable } from "inversify";
import * as Joi from "joi";
import customErrorMessages from "./BaseErrorSchema";

// @ts-ignore
@injectable()
class JoiValidationService implements ValidationService {
  public validate(data: any, schema: Joi.Schema) {
    const validationsOptions = { abortEarly: false, allowUnknown: true };

    const { error } = schema.validate(data, validationsOptions);

    return error;
  }

  public validateResult(errors: any) {
    const usefulErrors: any = {
      errors: {},
      type: "UnprocessableEntity",
    };

    errors.map((error: any) => {
      if (error.type === "E0001") {
        usefulErrors.type = "BadRequestException";
      }

      if (!usefulErrors.errors.hasOwnProperty(error.path.join("_"))) {
        usefulErrors.errors[error.path.join("_")] = {
          field: error.path.join("_"),
          type: error.type,
          message: customErrorMessages(error.message),
        };
      }
    });

    return usefulErrors;
  }
}

export default JoiValidationService;
