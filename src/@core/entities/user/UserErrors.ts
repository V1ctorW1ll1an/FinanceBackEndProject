import { IGenericError } from '@common/GenericErrors';
import { Result } from '@common/Result';

export namespace UserError {
  export class EmailInvalidError extends Result<IGenericError> {
    public constructor(email?: string) {
      super(false, {
        message: 'Email is invalid.',
      });
    }

    public static create(email?: string): EmailInvalidError {
      return new EmailInvalidError(email);
    }
  }

  export class EmailRequiredError extends Result<IGenericError> {
    public constructor(email?: string) {
      super(false, {
        message: 'Email is required.',
      });
    }

    public static create(email?: string): EmailInvalidError {
      return new EmailRequiredError(email);
    }
  }

  export class NameRequiredError extends Result<IGenericError> {
    public constructor(name?: string) {
      super(false, {
        message: 'Name is required.',
      });
    }

    public static create(name?: string): NameRequiredError {
      return new NameRequiredError(name);
    }
  }

  export class PasswordRequiredError extends Result<IGenericError> {
    public constructor() {
      super(false, {
        message: 'Password is required.',
      });
    }

    public static create(): PasswordRequiredError {
      return new PasswordRequiredError();
    }
  }

  export class PasswordInvalidError extends Result<IGenericError> {
    public constructor() {
      super(false, {
        message: 'Password is invalid.',
      });
    }

    public static create(): PasswordInvalidError {
      return new PasswordInvalidError();
    }
  }
}
