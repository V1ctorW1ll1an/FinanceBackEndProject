import { ValueObject } from '@entities/ValueObject';
import { Either, left, right } from '@logic/Either';
import { Result } from '@logic/Result';
import { UserError } from '../UserErrors';

export interface IPasswordProps {
  password: string;
}

export class Password extends ValueObject<IPasswordProps> {
  public get value(): string {
    return this.props.password;
  }

  private constructor(props: IPasswordProps) {
    super(props);
    this.props.password = props.password;
  }

  public static create(
    passwordProps: IPasswordProps,
  ): Either<UserError.PasswordRequiredError, Result<Password>> {
    // validate password
    if (!passwordProps.password) return left(UserError.PasswordRequiredError.create());

    const invalidPassword =
      passwordProps.password.length > 255 || passwordProps.password.length < 3;

    if (invalidPassword) return left(UserError.PasswordInvalidError.create());

    const passwordObj = new Password(passwordProps);
    return right(Result.ok<Password>(passwordObj));
  }
}
