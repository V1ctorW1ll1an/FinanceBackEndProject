import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateUserModule } from './user/createUser/createUser.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserSchema } from '@infra/db/user.schema';
@Module({
  imports: [
    CreateUserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, 'database.sqlite'),
      synchronize: true,
      logging: true,
      entities: [UserSchema],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
