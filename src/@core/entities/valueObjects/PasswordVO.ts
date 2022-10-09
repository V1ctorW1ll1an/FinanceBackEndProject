import { ValueObject } from '@entities/abstracts/ValueObject';
import { Either, left, right } from '@common/Either';
import { Result } from '@common/Result';
import { UserError } from '@entities/user/UserErrors';

export interface IPasswordProps {
  password: string;
}

export class Password extends ValueObject<IPasswordProps> {
  public get value(): string {
    return this.props.password;
  }

  protected set value(value: string) {
    this.props.password = value;
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
