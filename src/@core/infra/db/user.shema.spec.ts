import { UserEntity } from '@entities/user/UserEntity';
import { Email } from '@entities/valueObjects/EmailVO';
import { Password } from '@entities/valueObjects/PasswordVO';
import { BCryptProvider } from '@providers/BCryptProvider';
import { DataSource, Equal } from 'typeorm';
import { UserSchema } from './user.schema';
describe('UserSchema', () => {
  it('should be create a user', async () => {
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

    const userRepository = dataSource.getRepository(UserEntity);

    await userRepository.save(user.value.getValue());

    const userResponse = await userRepository.findOne({
      where: {
        email: Equal(JSON.stringify(user.value.getValue().email)),
      },
    });

    await dataSource.destroy();
  });
});
