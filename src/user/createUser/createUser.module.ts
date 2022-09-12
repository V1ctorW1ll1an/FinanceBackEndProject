import { Module } from '@nestjs/common';

import { CreateUserController } from './createUser.controller';
import { InMemoryUser } from '@infra/db/inMemoryUser';
import { CreateUserUseCase } from '@useCases/user/createUserUseCase';
import { IUserGateway } from '@gateways/user/userGateway';

@Module({
  controllers: [CreateUserController],
  providers: [
    {
      provide: InMemoryUser,
      useClass: InMemoryUser,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userGateway: IUserGateway) => {
        return new CreateUserUseCase(userGateway);
      },
      inject: [InMemoryUser],
    },
  ],
})
export class CreateUserModule {}
