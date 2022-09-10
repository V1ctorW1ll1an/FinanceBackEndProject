import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserUseCase } from '@useCases/user/createUserUseCase';
import { ICreateUserInputDTO } from '@useCases/user/createUserDTO';

@Controller('user')
export class UserController {
  constructor(private readonly _createUserUseCase: CreateUserUseCase) {}

  @Post()
  create(@Body() createUserDto: ICreateUserInputDTO) {
    return this._createUserUseCase.execute(createUserDto);
  }

  //#region comments
  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
  //#endregion
}
