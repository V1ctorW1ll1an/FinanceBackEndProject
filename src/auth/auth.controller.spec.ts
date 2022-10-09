import { InMemoryUser } from '@infra/db/inMemoryUser';
import { Test, TestingModule } from '@nestjs/testing';
import { Argon2Provider } from '@providers/Argon2Provider';
import { BCryptProvider } from '@providers/BCryptProvider';
import { JwtProvider } from '@providers/JwtProvider';
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
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
