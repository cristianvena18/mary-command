import ApplicationError from "./ApplicationException";

export default class EntityNotFoundException extends ApplicationError {
  public constructor(field: string, message: string) {
    const errorMessage = {
      errors: {
        [field]: {
          message,
          field,
        },
      },
    };

    // Calling parent constructor of base Error class.
    super(EntityNotFoundException.name, JSON.stringify(errorMessage));

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
