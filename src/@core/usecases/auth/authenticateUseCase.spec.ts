import { UserEntity } from '@entities/user/UserEntity';
import { Email } from '@entities/valueObjects/EmailVO';
import { Password } from '@entities/valueObjects/PasswordVO';
import { InMemoryUser } from '@infra/db/inMemoryUser';
import { right } from '@common/Either';
import { Result } from '@common/Result';
import { BCryptProvider } from '@providers/BCryptProvider';
import { JwtProvider } from '@providers/JwtProvider';
import { AuthenticateUseCase } from './AuthenticateUseCase';

describe('AuthenticateUseCase', () => {
  it('Should authenticate a user', async () => {
    const input = {
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    const expectedOutput = {
      id: expect.any(String),
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      token: expect.any(String),
    };

    const userGateway = new InMemoryUser();
    const jwtProvider = new JwtProvider();
    const hashProvider = new BCryptProvider();

    const email = Email.create(input.email);
    if (email.isLeft()) throw new Error('Email is invalid');
    const password = Password.create({ password: await hashProvider.hashPassword(input.password) });
    if (password.isLeft()) throw new Error('Password is invalid');

    const userToAdd = UserEntity.create({
      name: 'John Doe',
      email: email.value.getValue(),
      password: password.value.getValue(),
    });
    if (userToAdd.isLeft()) throw new Error('User is invalid');

    await userGateway.createUserGateway(userToAdd.value.getValue());

    const sut = new AuthenticateUseCase(userGateway, hashProvider, jwtProvider);

    const output = await sut.execute(input);

    expect(output).toEqual(right(Result.ok(expectedOutput)));
  });

  it('Should not authenticate a user with invalid email', async () => {
    const input = {
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    const userGateway = new InMemoryUser();
    const jwtProvider = new JwtProvider();
    const hashProvider = new BCryptProvider();

    const email = Email.create(input.email);
    if (email.isLeft()) throw new Error('Email is invalid');
    const password = Password.create({ password: await hashProvider.hashPassword(input.password) });
    if (password.isLeft()) throw new Error('Password is invalid');

    const userToAdd = UserEntity.create({
      name: 'John Doe',
      email: email.value.getValue(),
      password: password.value.getValue(),
    });

    if (userToAdd.isLeft()) throw new Error('User is invalid');

    await userGateway.createUserGateway(userToAdd.value.getValue());

    const sut = new AuthenticateUseCase(userGateway, hashProvider, jwtProvider);

    const output = await sut.execute({ email: 'teste@teste.com', password: '123456' });

    expect(output.isLeft()).toBeTruthy();
  });

  it('Should not authenticate a user with invalid password', async () => {
    const input = {
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    const userGateway = new InMemoryUser();
    const jwtProvider = new JwtProvider();
    const hashProvider = new BCryptProvider();

    const email = Email.create(input.email);
    if (email.isLeft()) throw new Error('Email is invalid');
    const password = Password.create({ password: await hashProvider.hashPassword(input.password) });
    if (password.isLeft()) throw new Error('Password is invalid');

    const userToAdd = UserEntity.create({
      name: 'John Doe',
      email: email.value.getValue(),
      password: password.value.getValue(),
    });

    if (userToAdd.isLeft()) throw new Error('User is invalid');

    await userGateway.createUserGateway(userToAdd.value.getValue());

    const sut = new AuthenticateUseCase(userGateway, hashProvider, jwtProvider);

    const output = await sut.execute({ email: input.email, password: 'wrongPass' });

    expect(output.value.getValue()).toEqual({ message: 'Email or password incorrect.' });
  });
});
