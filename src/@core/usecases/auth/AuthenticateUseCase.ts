import { ICryptoProvider } from '@providers/ICryptoProvider';
import { IJwtProvider } from '@providers/IJwtProvider';
import { IUserGateway } from '@gateways/user/userGateway';
import { Email } from '@entities/valueObjects/EmailVO';
import { UserError } from '@entities/user/UserErrors';
import { Either, left, right } from '@common/Either';
import { AppError } from '@common/GenericErrors';
import { Result } from '@common/Result';
import { AuthenticateError } from './authenticateErrors';
import { Password } from '@entities/valueObjects/PasswordVO';

export interface IAuthenticateInputDTO {
  email: string;
  password: string;
}
export interface IAuthenticateOutput {
  id: string;
  name: string;
  email: string;
  token: string;
}

type IAuthenticateOutputDTO = Either<
  | UserError.EmailInvalidError
  | UserError.EmailRequiredError
  | UserError.PasswordInvalidError
  | AppError.UnexpectedError
  | AuthenticateError.InvalidEmailOrPassword,
  Result<IAuthenticateOutput>
>;

export class AuthenticateUseCase {
  constructor(
    private readonly _userGateway: IUserGateway,
    private readonly _hashProvider: ICryptoProvider,
    private readonly _jwtProvider: IJwtProvider,
  ) {}

  async execute(input: IAuthenticateInputDTO): Promise<IAuthenticateOutputDTO> {
    const emailOrError: Either<
      UserError.EmailInvalidError | UserError.EmailRequiredError,
      Result<Email>
    > = Email.create(input.email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const passwordOrError: Either<
      UserError.PasswordRequiredError,
      Result<Password>
    > = Password.create({ password: input.password });

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const user = await this._userGateway.getUserByEmailGateway(emailOrError.value.getValue());

    if (!user) {
      return left(
        new AuthenticateError.InvalidEmailOrPassword(emailOrError.value.getValue().value),
      );
    }

    const passwordMatch = await this._hashProvider.comparePassword(
      input.password,
      user.password.props.password,
    );

    if (!passwordMatch) {
      return left(
        new AuthenticateError.InvalidEmailOrPassword(emailOrError.value.getValue().value),
      );
    }

    const token = this._jwtProvider.sign(user);

    return right(
      Result.ok<IAuthenticateOutput>({
        id: user.id,
        name: user.name,
        email: user.email.props.value,
        token,
      }),
    );
  }
}
