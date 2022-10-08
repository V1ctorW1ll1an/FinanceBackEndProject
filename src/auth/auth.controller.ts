import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthenticateUseCase, IAuthenticateInputDTO } from '@useCases/auth/AuthenticateUseCase';

@Controller('auth')
export class AuthController {
  constructor(private readonly authUserCase: AuthenticateUseCase) {}

  @Post()
  async login(@Body() authDTO: IAuthenticateInputDTO) {
    const result = await this.authUserCase.execute(authDTO);

    if (result.isLeft()) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          result: result.value.getValue(),
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      status: HttpStatus.OK,
      result: result.value.getValue(),
    };
  }
}
