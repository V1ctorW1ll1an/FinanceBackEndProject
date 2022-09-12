import { Either, left, right } from '@logic/Either';
import { Result } from '@logic/Result';
import { UserError } from '@entities/user/UserErrors';
import crypto from 'crypto';
import { Email } from './valueObjects/EmailVO';
import { Password } from './valueObjects/PasswordVO';
import { Entity } from '@entities/Entity';

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

  private constructor(props: IUserEntityProps) {
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
