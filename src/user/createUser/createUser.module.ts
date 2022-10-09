import { IUserGateway } from '@gateways/user/userGateway';
import { InMemoryUser } from '@infra/db/inMemoryUser';
import { Module } from '@nestjs/common';
import { CreateUserUseCase } from '@useCases/user/createUserUseCase';
import { Argon2Provider } from '@providers/Argon2Provider';
import { ICryptoProvider } from '@providers/ICryptoProvider';
import { BCryptProvider } from '@providers/BCryptProvider';
import { CreateUserController } from './createUser.controller';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { UserSchema } from '@infra/db/user.schema';
import { UserEntity } from '@entities/user/UserEntity';
import { UserTypeOrmGateway } from '@gateways/user/userTyperOrmGateway';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
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
      provide: UserTypeOrmGateway,
      useFactory: (dataSource: DataSource) =>
        new UserTypeOrmGateway(dataSource.getRepository(UserEntity)),
      inject: [getDataSourceToken()],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userGateway: IUserGateway, cryptoProvider: ICryptoProvider) => {
        return new CreateUserUseCase(userGateway, cryptoProvider);
      },
      inject: [UserTypeOrmGateway, BCryptProvider],
    },
  ],
})
export class CreateUserModule {}
