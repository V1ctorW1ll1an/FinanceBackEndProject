import { IUserGateway } from '@gateways/user/userGateway';
import { InMemoryUser } from '@infra/db/inMemoryUser';
import { Test, TestingModule } from '@nestjs/testing';
import { Argon2Provider } from '@providers/Argon2Provider';
import { BCryptProvider } from '@providers/BCryptProvider';
import { ICryptoProvider } from '@providers/ICryptoProvider';
import { IJwtProvider } from '@providers/IJwtProvider';
import { JwtProvider } from '@providers/JwtProvider';
import { AuthenticateUseCase } from '@useCases/auth/AuthenticateUseCase';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
