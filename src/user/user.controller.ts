import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
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
      Object.keys(createUserDto).length !== 3 || validateRequestKeys(createUserDto, validKeys);

    if (invalidRequest)
      throw new HttpException(
        { status: 'error', statusCode: HttpStatus.BAD_REQUEST, response: 'Invalid request' },
        HttpStatus.BAD_REQUEST,
      );

    const result = await this._createUserUseCase.execute(createUserDto);

    if (result.isLeft()) {
      throw new HttpException(
        {
          status: 'error',
          statusCode: HttpStatus.BAD_REQUEST,
          result: result.value.getValue(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return result.value.getValue();
  }
}
