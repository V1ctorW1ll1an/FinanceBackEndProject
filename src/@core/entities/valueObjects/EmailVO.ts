import { ValueObject } from '@entities/abstracts/ValueObject';
import { Either, left, right } from '@common/Either';
import { Result } from '@common/Result';
import { UserError } from '../user/UserErrors';

export interface IEmailProps {
  value: string;
}

export class Email extends ValueObject<IEmailProps> {
  public get value(): string {
    return this.props.value;
  }

  protected set value(value: string) {
    this.props.value = value;
  }

  private constructor(props: IEmailProps) {
    super(props);
  }

  public static create(
    email: string,
  ): Either<UserError.EmailInvalidError | UserError.EmailRequiredError, Result<Email>> {
    // validate email
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email) return left(UserError.EmailRequiredError.create());

    const invalidEmail = email.length > 255 || email.length < 3 || !regex.test(email);

    if (invalidEmail) return left(UserError.EmailInvalidError.create());

    const emailObj = new Email({ value: email });
    return right(Result.ok<Email>(emailObj));
  }
}
