import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateUserModule } from './user/createUser/createUser.module';

@Module({
  imports: [CreateUserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
