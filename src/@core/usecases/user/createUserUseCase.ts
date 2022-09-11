import { Email, Password, UserEntity } from '@entities/user/UserEntity';
import { IUserGateway } from '@gateways/user/userGateway';
import { Result } from '@logic/Result';
import { ICreateUserInputDTO, ICreateUserOutputDTO } from './createUserDTO';

export class CreateUserUseCase {
  private readonly _userGateway: IUserGateway;

  constructor(userGateway: IUserGateway) {
    this._userGateway = userGateway;
  }

  async execute(
    input: ICreateUserInputDTO,
  ): Promise<Result<ICreateUserOutputDTO>> {
    const emailOrError = Email.create(input.email);

    if (emailOrError.isFailure) {
      return Result.fail<ICreateUserOutputDTO>(emailOrError.error);
    }

    const passwordOrError = Password.create({ password: input.password });

    if (passwordOrError.isFailure) {
      return Result.fail<ICreateUserOutputDTO>(passwordOrError.error);
    }

    const user = UserEntity.create({
      name: input.name,
      email: emailOrError.getValue(),
      password: passwordOrError.getValue(),
    });

    if (user.isFailure) {
      return Result.fail<ICreateUserOutputDTO>(user.error);
    }

    try {
      await this._userGateway.createUserGateway(user.getValue());

      return Result.ok<ICreateUserOutputDTO>({
        id: user.getValue().id,
        name: user.getValue().name,
        email: user.getValue().email.value,
      });
    } catch (error) {
      return Result.fail<ICreateUserOutputDTO>('Error creating user');
    }
  }
}
