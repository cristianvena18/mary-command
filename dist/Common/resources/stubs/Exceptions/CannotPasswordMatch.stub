import ApplicationError from "./ApplicationException";

export default class CannotPasswordMatch extends ApplicationError {
  constructor(field: string, message?: string) {
    const errorMessage = {
      errors: {
        [field]: {
          message,
          field,
        },
      },
    };

    // Calling parent constructor of base Error class.
    super(CannotPasswordMatch.name, JSON.stringify(errorMessage));

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
