import { IGenericError } from '@common/GenericErrors';
import { Result } from '@common/Result';

export namespace CreateUserError {
  export class EmailAlreadyExistsError extends Result<IGenericError> {
    public constructor(email: string) {
      super(false, {
        message: `Email already exists.`,
      });
    }

    public static create(email: string): EmailAlreadyExistsError {
      return new EmailAlreadyExistsError(email);
    }
  }
}
