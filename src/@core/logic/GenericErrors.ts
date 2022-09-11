import { Result } from '@logic/Result';

export interface IGenericError {
  message: string;
  error?: any;
}

export namespace AppError {
  export class UnexpectedError extends Result<IGenericError> {
    public constructor(err: any) {
      super(false, {
        message: `An unexpected error occurred.`,
        error: err,
      });
    }

    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}
