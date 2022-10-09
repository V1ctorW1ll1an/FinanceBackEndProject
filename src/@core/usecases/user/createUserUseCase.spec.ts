import { UserEntity } from '@entities/user/UserEntity';
import { UserError } from '@entities/user/UserErrors';
import { Email } from '@entities/valueObjects/EmailVO';
import { Password } from '@entities/valueObjects/PasswordVO';
import { ICreateUserInputDTO, ICreateUserOutputDTO } from './createUserDTO';
import { CreateUserUseCase } from './createUserUseCase';
import { CreateUserError } from '@useCases/user/createUserErrors';

describe('CreateUserUseCase', () => {
  it('Should create a user', async () => {
    // input data, execute use case, return output data
    const input: ICreateUserInputDTO = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    const expectedOutput: ICreateUserOutputDTO = {
      id: expect.any(String),
      name: 'John Doe',
      email: 'johndoe@gmail.com',
    };

    const userGateway = () => {
      return {
        createUserGateway: jest.fn(),
        getUserByEmailGateway: jest.fn(),
        getAllUsersGateway: jest.fn(),
      };
    };

    const cryptoService = () => {
      return {
        hashPassword: jest.fn(),
        comparePassword: jest.fn(),
      };
    };

    const createUserUseCase = new CreateUserUseCase(userGateway(), cryptoService());

    const output = await createUserUseCase.execute(input);

    expect(output.value.getValue()).toMatchObject(expectedOutput);
  });

  it('Should not create a user with an invalid email', async () => {
    // input data, execute use case, return output data
    const input: ICreateUserInputDTO = {
      name: 'John Doe',
      email: 'johndoegmail.com',
      password: '123456',
    };

    const userGateway = () => {
      return {
        createUserGateway: jest.fn(),
        getUserByEmailGateway: jest.fn(),
        getAllUsersGateway: jest.fn(),
      };
    };

    const cryptoService = () => {
      return {
        hashPassword: jest.fn(),
        comparePassword: jest.fn(),
      };
    };

    const createUserUseCase = new CreateUserUseCase(userGateway(), cryptoService());

    const output = await createUserUseCase.execute(input);

    expect(output.isLeft()).toBeTruthy();
    expect(output.value).toBeInstanceOf(UserError.EmailInvalidError);
    expect(output.value.getValue().message).toBe('Email is invalid.');
  });

  it('Should not create a user with an invalid password', async () => {
    const input: ICreateUserInputDTO = {
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '',
    };

    const userGateway = () => {
      return {
        createUserGateway: jest.fn(),
        getUserByEmailGateway: jest.fn(),
        getAllUsersGateway: jest.fn(),
      };
    };

    const cryptoService = () => {
      return {
        hashPassword: jest.fn(),
        comparePassword: jest.fn(),
      };
    };

    const createUserUseCase = new CreateUserUseCase(userGateway(), cryptoService());

    const output = await createUserUseCase.execute(input);

    expect(output.isLeft()).toBeTruthy();
    expect(output.value).toBeInstanceOf(UserError.PasswordRequiredError);
    expect(output.value.getValue().message).toBe('Password is required.');
  });

  it("Should not create a user with an email that's already in use", async () => {
    const input: ICreateUserInputDTO = {
      name: 'John Doe',
      email: 'johndoe@teste.com',
      password: '123456',
    };

    const userMock = UserEntity.create({
      name: input.name,
      email: Email.create(input.email).value.getValue() as Email,
      password: Password.create({ password: input.password }).value.getValue() as Password,
    }).value.getValue() as UserEntity;

    const userGateway = () => {
      return {
        createUserGateway: jest.fn(),
        getUserByEmailGateway: jest.fn().mockReturnValue(userMock),
        getAllUsersGateway: jest.fn(),
      };
    };

    const cryptoService = () => {
      return {
        hashPassword: jest.fn(),
        comparePassword: jest.fn(),
      };
    };

    const createUserUseCase = new CreateUserUseCase(userGateway(), cryptoService());

    await createUserUseCase.execute(input);
    const output = await createUserUseCase.execute(input);

    expect(output.isLeft()).toBeTruthy();
    expect(output.value).toBeInstanceOf(CreateUserError.EmailAlreadyExistsError);
    expect(output.value.getValue().message).toBe('Email already exists.');
  });
});
