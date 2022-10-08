import { IGenericError } from '@logic/GenericErrors';
import { Result } from '@logic/Result';

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
