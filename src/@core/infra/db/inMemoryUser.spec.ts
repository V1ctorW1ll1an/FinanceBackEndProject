import { UserEntity } from '@entities/user/UserEntity';
import { Email } from '@entities/valueObjects/EmailVO';
import { Password } from '@entities/valueObjects/PasswordVO';
import { InMemoryUser } from './inMemoryUser';

describe('CreateUserUseCase', () => {
  it('Should create a user', async () => {
    // input data, execute use case, return output data
    const input = {
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    };

    const userMock = UserEntity.create({
      name: input.name,
      email: Email.create(input.email).value.getValue() as Email,
      password: Password.create({ password: input.password }).value.getValue() as Password,
    }).value.getValue() as UserEntity;

    const userGateway = new InMemoryUser();

    await userGateway.createUserGateway(userMock);

    expect(userGateway.users).toContain(userMock);
  });

  it('Should return user by email', async () => {
    const input = {
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    };

    const userMock = UserEntity.create({
      name: input.name,
      email: Email.create(input.email).value.getValue() as Email,
      password: Password.create({ password: input.password }).value.getValue() as Password,
    }).value.getValue() as UserEntity;

    const userGateway = new InMemoryUser();

    await userGateway.createUserGateway(userMock);

    const user = await userGateway.getUserByEmailGateway(userMock.email);

    expect(user).toEqual(userMock);
  });
});
