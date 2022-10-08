import { IUserGateway } from '@gateways/user/userGateway';
import { InMemoryUser } from '@infra/db/inMemoryUser';
import { Module } from '@nestjs/common';
import { CreateUserUseCase } from '@useCases/user/createUserUseCase';
import { Argon2Service } from 'src/@core/services/Argon2Service';
import { ICryptoService } from 'src/@core/services/ICryptoService';
import { BCryptService } from './../../@core/services/BCryptService';
import { CreateUserController } from './createUser.controller';

@Module({
  controllers: [CreateUserController],
  providers: [
    {
      provide: InMemoryUser,
      useClass: InMemoryUser,
    },
    {
      provide: Argon2Service,
      useClass: Argon2Service,
    },
    {
      provide: BCryptService,
      useClass: BCryptService,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userGateway: IUserGateway, cryptoService: ICryptoService) => {
        return new CreateUserUseCase(userGateway, cryptoService);
      },
      inject: [InMemoryUser, BCryptService],
    },
  ],
})
export class CreateUserModule {}
