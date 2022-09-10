import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { InMemoryUser } from 'src/@core/infra/db/inMemoryUser';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: InMemoryUser,
      useClass: InMemoryUser,
    },
  ],
})
export class UserModule {}
