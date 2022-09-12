import { Either, left, right } from '@logic/Either';
import { Result } from '@logic/Result';
import { UserError } from '../UserErrors';
import crypto from 'crypto';
import { ValueObject } from '@entities/ValueObject';

export interface IPasswordProps {
  password: string;
  salt?: string;
}

export class Password extends ValueObject<IPasswordProps> {
  public get value(): string {
    return this.props.password;
  }

  private constructor(props: IPasswordProps) {
    super(props);
    this.props.salt = props.salt ? props.salt : crypto.randomBytes(16).toString('hex');
    this.props.password = this.encryptPassword(props.password);
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

  private encryptPassword(password: string): string {
    const hashedPassword = crypto
      .pbkdf2Sync(password, this.props.salt, 1000, 64, `sha512`)
      .toString(`hex`);

    return hashedPassword;
  }

  public comparePassword(password: string): boolean {
    const hash = crypto.pbkdf2Sync(password, this.props.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.props.password === hash;
  }
}
