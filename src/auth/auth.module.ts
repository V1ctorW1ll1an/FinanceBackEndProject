import { UserEntity } from '@entities/user/UserEntity';
import { IUserGateway } from '@gateways/user/userGateway';
import { UserTypeOrmGateway } from '@gateways/user/userTyperOrmGateway';
import { InMemoryUser } from '@infra/db/inMemoryUser';
import { UserSchema } from '@infra/db/user.schema';
import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { Argon2Provider } from '@providers/Argon2Provider';
import { BCryptProvider } from '@providers/BCryptProvider';
import { ICryptoProvider } from '@providers/ICryptoProvider';
import { IJwtProvider } from '@providers/IJwtProvider';
import { JwtProvider } from '@providers/JwtProvider';
import { AuthenticateUseCase } from '@useCases/auth/AuthenticateUseCase';
import { DataSource } from 'typeorm';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  controllers: [AuthController],
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
      provide: JwtProvider,
      useClass: JwtProvider,
    },
    {
      provide: UserTypeOrmGateway,
      useFactory: (dataSource: DataSource) =>
        new UserTypeOrmGateway(dataSource.getRepository(UserEntity)),
      inject: [getDataSourceToken()],
    },
    {
      provide: AuthenticateUseCase,
      useFactory: (
        userGateway: IUserGateway,
        cryptoProvider: ICryptoProvider,
        jwtProvider: IJwtProvider,
      ) => new AuthenticateUseCase(userGateway, cryptoProvider, jwtProvider),
      inject: [UserTypeOrmGateway, BCryptProvider, JwtProvider],
    },
  ],
})
export class AuthModule {}
