import ApplicationError from "./ApplicationException";

export default class RelatedEntitiesConstraintFailed extends ApplicationError {
  public constructor(message: string) {
    // Calling parent constructor of base Error class.
    super(RelatedEntitiesConstraintFailed.name, message);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
