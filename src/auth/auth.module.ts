import { IUserGateway } from '@gateways/user/userGateway';
import { InMemoryUser } from '@infra/db/inMemoryUser';
import { Module } from '@nestjs/common';
import { Argon2Provider } from '@providers/Argon2Provider';
import { BCryptProvider } from '@providers/BCryptProvider';
import { ICryptoProvider } from '@providers/ICryptoProvider';
import { IJwtProvider } from '@providers/IJwtProvider';
import { JwtProvider } from '@providers/JwtProvider';
import { AuthenticateUseCase } from '@useCases/auth/AuthenticateUseCase';
import { AuthController } from './auth.controller';

@Module({
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
      provide: AuthenticateUseCase,
      useFactory: (
        userGateway: IUserGateway,
        cryptoProvider: ICryptoProvider,
        jwtProvider: IJwtProvider,
      ) => new AuthenticateUseCase(userGateway, cryptoProvider, jwtProvider),
      inject: [InMemoryUser, BCryptProvider, JwtProvider],
    },
  ],
})
export class AuthModule {}
