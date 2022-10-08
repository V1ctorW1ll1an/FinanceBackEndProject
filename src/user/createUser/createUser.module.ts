import { IUserGateway } from '@gateways/user/userGateway';
import { InMemoryUser } from '@infra/db/inMemoryUser';
import { Module } from '@nestjs/common';
import { CreateUserUseCase } from '@useCases/user/createUserUseCase';
import { Argon2Provider } from '@providers/Argon2Provider';
import { ICryptoProvider } from '@providers/ICryptoProvider';
import { BCryptProvider } from '@providers/BCryptProvider';
import { CreateUserController } from './createUser.controller';

@Module({
  controllers: [CreateUserController],
  providers: [
    {
      provide: InMemoryUser,
      useClass: InMemoryUser,
    },
    {
      provide: Argon2Provider,
      useClass: Argon2Provider,
    },
    {
      provide: BCryptProvider,
      useClass: BCryptProvider,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userGateway: IUserGateway, cryptoProvider: ICryptoProvider) => {
        return new CreateUserUseCase(userGateway, cryptoProvider);
      },
      inject: [InMemoryUser, BCryptProvider],
    },
  ],
})
export class CreateUserModule {}
