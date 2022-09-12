import { UserEntity } from '@entities/user/UserEntity';
import { IUserGateway } from '@gateways/user/userGateway';
import { Either, left, right } from '@logic/Either';
import { AppError } from '@logic/GenericErrors';
import { Result } from '@logic/Result';
import { ICreateUserInputDTO, ICreateUserOutputDTO } from './createUserDTO';
import { UserError } from '../../entities/user/UserErrors';
import { Email } from '@entities/user/valueObjects/EmailVO';
import { Password } from '@entities/user/valueObjects/PasswordVO';

type CreateUserUseCaseOutput = Either<
  | UserError.EmailInvalidError
  | UserError.EmailRequiredError
  | UserError.NameRequiredError
  | UserError.PasswordInvalidError
  | UserError.PasswordRequiredError
  | UserError.EmailAlreadyExistsError
  | AppError.UnexpectedError,
  Result<any>
>;

export class CreateUserUseCase {
  private readonly _userGateway: IUserGateway;

  constructor(userGateway: IUserGateway) {
    this._userGateway = userGateway;
  }

  async execute(input: ICreateUserInputDTO): Promise<CreateUserUseCaseOutput> {
    // validations
    const emailOrError: Either<
      UserError.EmailInvalidError | UserError.EmailRequiredError,
      Result<Email>
    > = Email.create(input.email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const passwordOrError: Either<
      UserError.PasswordInvalidError | UserError.PasswordRequiredError,
      Result<Password>
    > = Password.create({
      password: input.password,
    });

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const userOrError = UserEntity.create({
      name: input.name,
      email: emailOrError.value.getValue(),
      password: passwordOrError.value.getValue(),
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    // try execute use case
    try {
      const user = await this._userGateway.getUserByEmailGateway(
        userOrError.value.getValue().email.value,
      );

      if (user && user.email.value && userOrError.value.getValue().email.equals(user.email)) {
        return left(
          new UserError.EmailAlreadyExistsError(userOrError.value.getValue().email.value),
        );
      }

      await this._userGateway.createUserGateway(userOrError.value.getValue());
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }

    // if success return the user with the id
    return right(
      Result.ok<ICreateUserOutputDTO>({
        id: userOrError.value.getValue().id,
        name: userOrError.value.getValue().name,
        email: userOrError.value.getValue().email.value,
      }),
    );
  }
}
