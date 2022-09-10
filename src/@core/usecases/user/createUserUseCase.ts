import { Email, Password, UserEntity } from '@entities/user/UserEntity';
import { IUserGateway } from '@gateways/user/userGateway';
import { ICreateUserInputDTO, ICreateUserOutputDTO } from './createUserDTO';

export class CreateUserUseCase {
  private readonly _userGateway: IUserGateway;

  constructor(userGateway: IUserGateway) {
    this._userGateway = userGateway;
  }

  async execute(input: ICreateUserInputDTO): Promise<ICreateUserOutputDTO> {
    const user = UserEntity.create({
      name: input.name,
      email: Email.create(input.email),
      password: Password.create({
        password: input.password,
        salt: input.salt,
      }),
    });

    await this._userGateway.createUserGateway(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      password: user.password.value,
    };
  }
}
