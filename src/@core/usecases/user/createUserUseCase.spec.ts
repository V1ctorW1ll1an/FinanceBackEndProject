import { ICreateUserInputDTO, ICreateUserOutputDTO } from './createUserDTO';
import { CreateUserError } from './createUserErrors';
import { CreateUserUseCase } from './createUserUseCase';

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

    expect(output.value.getValue()).toMatchObject(expectedOutput);
  });
});
