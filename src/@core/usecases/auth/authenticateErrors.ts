import { IGenericError } from '@common/GenericErrors';
import { Result } from '@common/Result';

export namespace AuthenticateError {
  export class InvalidEmailOrPassword extends Result<IGenericError> {
    public constructor(email: string) {
      super(false, {
        message: `Email or password incorrect.`,
      });
    }

    public static create(email: string): InvalidEmailOrPassword {
      return new InvalidEmailOrPassword(email);
    }
  }
}
