import { UserEntity } from '@entities/user/UserEntity';
import { Email } from '@entities/valueObjects/EmailVO';
import { Password } from '@entities/valueObjects/PasswordVO';
import { UserSchema } from '@infra/db/user.schema';
import { BCryptProvider } from '@providers/BCryptProvider';
import { DataSource, Equal } from 'typeorm';
import { UserTypeOrmGateway } from './userTyperOrmGateway';

describe('UserTypeOrmGateway', () => {
  it('should be insert user with typeOrm', async () => {
    const input = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    };

    const dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      logging: true,
      entities: [UserSchema],
    });

    const hashProvider = new BCryptProvider();

    const email = Email.create(input.email);
    if (email.isLeft()) throw new Error('Email is invalid');

    const password = Password.create({
      password: await hashProvider.hashPassword(input.password),
    });
    if (password.isLeft()) throw new Error('Password is invalid');

    const user = UserEntity.create({
      name: 'John Doe',
      email: email.value.getValue(),
      password: password.value.getValue(),
    });

    if (user.isLeft()) throw new Error('User is invalid');

    await dataSource.initialize();

    const ormRepository = dataSource.getRepository(UserEntity);

    const userRepository = new UserTypeOrmGateway(ormRepository);

    await userRepository.createUserGateway(user.value.getValue());

    const userResponse = await ormRepository.findOne({
      where: { email: Equal(user.value.getValue().email) },
    });

    console.log(userResponse);

    await dataSource.destroy();
  });
});
