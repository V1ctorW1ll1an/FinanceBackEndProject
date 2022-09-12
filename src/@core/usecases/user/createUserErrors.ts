import { IGenericError } from '@logic/GenericErrors';
import { Result } from '@logic/Result';

export namespace CreateUserError {
  export class EmailAlreadyExistsError extends Result<IGenericError> {
    public constructor(email: string) {
      super(false, {
        message: `Email already exists`,
      });
    }

    public static create(email: string): EmailAlreadyExistsError {
      return new EmailAlreadyExistsError(email);
    }
  }
}
