import { Email, Password, UserEntity } from '@entities/user/UserEntity';
import { IUserGateway } from '@gateways/user/userGateway';
import { Either, left, right } from '@logic/Either';
import { AppError } from '@logic/GenericErrors';
import { Result } from '@logic/Result';
import { ICreateUserInputDTO, ICreateUserOutputDTO } from './createUserDTO';
import { UserError } from '../../entities/user/UserErrors';

type CreateUserUseCaseOutput<T> = Either<
  | Result<UserError.EmailInvalidError>
  | Result<UserError.EmailRequiredError>
  | Result<UserError.NameRequiredError>
  | Result<UserError.PasswordRequiredError>
  | Result<AppError.UnexpectedError>,
  Result<T>
>;

export class CreateUserUseCase {
  private readonly _userGateway: IUserGateway;

  constructor(userGateway: IUserGateway) {
    this._userGateway = userGateway;
  }

  async execute(input: ICreateUserInputDTO): Promise<CreateUserUseCaseOutput<any>> {
    const emailOrError = Email.create(input.email);

    if (emailOrError.isLeft()) {
      const error = emailOrError.value;

      switch (error.constructor) {
        case UserError.EmailRequiredError:
          return left(Result.fail<UserError.EmailRequiredError>(error));
        case UserError.EmailInvalidError:
          return left(Result.fail<UserError.EmailInvalidError>(error));
        default:
          break;
      }
    }

    const passwordOrError = Password.create({ password: input.password });

    if (passwordOrError.isLeft()) {
      const error = passwordOrError.value;

      switch (error.constructor) {
        case UserError.PasswordRequiredError:
          return left(Result.fail<UserError.PasswordRequiredError>(error));
        default:
          break;
      }
    }

    if (passwordOrError.isRight() && emailOrError.isRight()) {
      const userOrError = UserEntity.create({
        name: input.name,
        email: emailOrError.value.getValue(),
        password: passwordOrError.value.getValue(),
      });

      if (userOrError.isLeft()) {
        const error = userOrError.value;

        switch (error.constructor) {
          case UserError.NameRequiredError:
            return left(Result.fail<UserError.NameRequiredError>(error));
          default:
            break;
        }
      }

      if (userOrError.isRight()) {
        try {
          await this._userGateway.createUserGateway(userOrError.value.getValue());
          return right(
            Result.ok<ICreateUserOutputDTO>({
              id: userOrError.value.getValue().id,
              name: userOrError.value.getValue().name,
              email: userOrError.value.getValue().email.value,
            }),
          );
        } catch (error) {
          return left(Result.fail<AppError.UnexpectedError>(error));
        }
      }
    }
  }
}
