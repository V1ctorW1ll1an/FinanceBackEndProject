import { Either, left, right } from '@common/Either';
import { Result } from '@common/Result';
import { UserError } from '@entities/user/UserErrors';
import { Email } from '../valueObjects/EmailVO';
import { Password } from '../valueObjects/PasswordVO';
import { Entity } from '@entities/abstracts/Entity';

export interface IUserEntityProps {
  id?: string;
  name: string;
  email: Email;
  password: Password;
}

export class UserEntity extends Entity<IUserEntityProps> {
  public get name(): string {
    return this.props.name;
  }

  public get email(): Email {
    return this.props.email;
  }

  public get password(): Password {
    return this.props.password;
  }

  protected set name(value: string) {
    this.props.name = value;
  }

  protected set email(value: Email) {
    this.props.email = value;
  }

  protected set password(value: Password) {
    this.props.password = value;
  }

  private constructor(props: IUserEntityProps) {
    if (!props) {
      // @ts-expect-error used by orm
      props = {};
    }
    super(props);
  }

  public static create(
    userProps: IUserEntityProps,
  ): Either<UserError.NameRequiredError, Result<UserEntity>> {
    // validate props

    if (!userProps.name) {
      return left(UserError.NameRequiredError.create());
    }

    // create user
    const userEntity = new UserEntity(userProps);
    return right(Result.ok<UserEntity>(userEntity));
  }
}
