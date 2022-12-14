import { UserEntity } from '@entities/user/UserEntity';
import { Email } from '@entities/valueObjects/EmailVO';
import { Password } from '@entities/valueObjects/PasswordVO';
import { IUserGateway } from '@gateways/user/userGateway';
import { Either, left, right } from '@common/Either';
import { AppError } from '@common/GenericErrors';
import { Result } from '@common/Result';
import { ICryptoProvider } from '@providers/ICryptoProvider';
import { UserError } from '@entities/user/UserErrors';
import { ICreateUserInputDTO, ICreateUserOutputDTO } from './createUserDTO';
import { CreateUserError } from './createUserErrors';

type CreateUserUseCaseOutput = Either<
  | UserError.EmailInvalidError
  | UserError.EmailRequiredError
  | UserError.NameRequiredError
  | UserError.PasswordInvalidError
  | UserError.PasswordRequiredError
  | CreateUserError.EmailAlreadyExistsError
  | AppError.UnexpectedError,
  Result<any>
>;

export class CreateUserUseCase {
  private readonly _userGateway: IUserGateway;
  private readonly _cryptoProvider: ICryptoProvider;

  constructor(userGateway: IUserGateway, cryptoService: ICryptoProvider) {
    this._userGateway = userGateway;
    this._cryptoProvider = cryptoService;
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

    const pass = await this._cryptoProvider.hashPassword(input.password);
    const hashedPassword = Password.create({
      password: pass,
    });

    const userOrError = UserEntity.create({
      name: input.name,
      email: emailOrError.value.getValue(),
      password: hashedPassword.value.getValue() as Password,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    // try execute use case
    try {
      const user = await this._userGateway.getUserByEmailGateway(
        userOrError.value.getValue().email,
      );

      if (user) {
        return left(
          new CreateUserError.EmailAlreadyExistsError(userOrError.value.getValue().email.value),
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
