import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { CreateUserUseCase } from '@useCases/user/createUserUseCase';
import { ICreateUserInputDTO } from '@useCases/user/createUserDTO';

const validateRequestKeys = (obj: ICreateUserInputDTO, keys: string[]) =>
  Object.keys(obj).some((key) => !keys.includes(key));

@Controller('user')
export class UserController {
  constructor(private readonly _createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() createUserDto: ICreateUserInputDTO) {
    const validKeys = ['name', 'email', 'password'];

    const invalidRequest =
      Object.keys(createUserDto).length !== 3 ||
      validateRequestKeys(createUserDto, validKeys);

    if (invalidRequest)
      throw new HttpException(
        { status: 'error', statusCode: 400, message: 'Invalid request' },
        400,
      );

    const result = await this._createUserUseCase.execute(createUserDto);

    if (result.isFailure) {
      throw new HttpException(
        {
          status: 'error',
          statusCode: 400,
          message: result.error,
        },
        400,
      );
    }

    return result.getValue();
  }
}
