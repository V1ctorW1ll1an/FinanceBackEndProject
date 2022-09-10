import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { InMemoryUser } from '@infra/db/inMemoryUser';
import { CreateUserUseCase } from '@useCases/user/createUserUseCase';
import { IUserGateway } from '@gateways/user/userGateway';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
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
export class UserModule {}
