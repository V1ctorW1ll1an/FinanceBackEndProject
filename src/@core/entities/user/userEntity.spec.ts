// test user entity

import { UserEntity, IUserEntityProps } from './UserEntity';
import { UserError } from './UserErrors';
import { Email } from './valueObjects/EmailVO';
import { Password } from './valueObjects/PasswordVO';

describe('UserEntity', () => {
  it('should throw error without email', () => {
    const result = Email.create('');

    if (result.isLeft()) {
      const error = result.value;
      expect(error.constructor).toBe(UserError.EmailRequiredError);
      expect(error.getValue().message).toBe('Email is required');
    }
  });

  it('should throw error without password', () => {
    const result = Password.create({ password: '', salt: '' });

    if (result.isLeft()) {
      const error = result.value;
      expect(error.constructor).toBe(UserError.PasswordRequiredError);
      expect(error.getValue().message).toBe('Password is required');
    }
  });

  it('should throw error with invalid password', () => {
    const test1 = Password.create({ password: 'a'.repeat(256), salt: '' });

    if (test1.isLeft()) {
      const error = test1.value;
      expect(error.constructor).toBe(UserError.PasswordInvalidError);
      expect(error.getValue().message).toBe('Password is invalid');
    }

    const test2 = Password.create({ password: 'a'.repeat(2), salt: '' });

    if (test2.isLeft()) {
      const error = test2.value;
      expect(error.constructor).toBe(UserError.PasswordInvalidError);
      expect(error.getValue().message).toBe('Password is invalid');
    }
  });

  it('should throw error with invalid email', () => {
    const test1 = Email.create('a'.repeat(256));

    if (test1.isLeft()) {
      const error = test1.value;
      expect(error.constructor).toBe(UserError.EmailInvalidError);
      expect(error.getValue().message).toBe('Email is invalid');
    }

    const test2 = Email.create('invalid@');

    if (test2.isLeft()) {
      const error = test2.value;
      expect(error.constructor).toBe(UserError.EmailInvalidError);
      expect(error.getValue().message).toBe('Email is invalid');
    }

    const test3 = Email.create('invalid@invalid');

    if (test3.isLeft()) {
      const error = test3.value;
      expect(error.constructor).toBe(UserError.EmailInvalidError);
      expect(error.getValue().message).toBe('Email is invalid');
    }

    const test4 = Email.create('a'.repeat(2));

    if (test4.isLeft()) {
      const error = test4.value;
      expect(error.constructor).toBe(UserError.EmailInvalidError);
      expect(error.getValue().message).toBe('Email is invalid');
    }
  });

  it('should not create a user without name', () => {
    const userProps: IUserEntityProps = {
      id: 'id',
      name: '',
      email: Email.create('jonhdoe@gmail.com').value.getValue() as Email,
      password: Password.create({
        password: '12345',
        salt: '',
      }).value.getValue() as Password,
    };

    const result = UserEntity.create(userProps);

    if (result.isLeft()) {
      const error = result.value;
      expect(error.constructor).toBe(UserError.NameRequiredError);
      expect(error.getValue().message).toBe('Name is required');
    }
  });

  it('should create a user', () => {
    const userProps: IUserEntityProps = {
      id: '8432742374823',
      name: 'john doe',
      email: Email.create('jonhdoe@gmail.com').value.getValue() as Email,
      password: Password.create({
        password: '12345',
        salt: '',
      }).value.getValue() as Password,
    };

    const user = UserEntity.create(userProps).value.getValue() as UserEntity;

    expect(user.id).toBe('8432742374823');
    expect(user.name).toBe('john doe');
    expect(user.email.value).toBe('jonhdoe@gmail.com');
    expect(user.password.value).not.toBe('12345');
  });

  it('Should create user and crypto password', () => {
    const userProps: IUserEntityProps = {
      id: '8432742374823',
      name: 'john doe',
      email: Email.create('johndoe@gmail.com').value.getValue() as Email,
      password: Password.create({
        password: '12345',
        salt: '',
      }).value.getValue() as Password,
    };

    const user = UserEntity.create(userProps).value.getValue() as UserEntity;

    expect(user.password.value).not.toBe('12345');
  });

  it('Should compare password', () => {
    const userProps: IUserEntityProps = {
      id: '8432742374823',
      name: 'john doe',
      email: Email.create('johndoe@gmail.com').value.getValue() as Email,
      password: Password.create({
        password: '12345',
        salt: '',
      }).value.getValue() as Password,
    };

    const user = UserEntity.create(userProps).value.getValue() as UserEntity;

    expect(user.password.comparePassword('12345')).toBe(true);

    expect(user.password.comparePassword('123456')).toBe(false);
  });

  it('Should return true with salt', () => {
    const userProps: IUserEntityProps = {
      id: '8432742374823',
      name: 'john doe',
      email: Email.create('johndoe@gmail.com').value.getValue() as Email,
      password: Password.create({
        password: '12345',
        salt: '4666d4544c08bcbd6306ef4b842b1b3f',
      }).value.getValue() as Password,
    };

    const user = UserEntity.create(userProps).value.getValue() as UserEntity;

    expect(user.password.comparePassword('12345')).toBe(true);
  });

  it('Should create an id when it was not informed', () => {
    const userProps: IUserEntityProps = {
      id: '',
      name: 'john doe',
      email: Email.create('johndoe@gmail.com').value.getValue() as Email,
      password: Password.create({
        password: '12345',
        salt: '',
      }).value.getValue() as Password,
    };

    const user = UserEntity.create(userProps).value.getValue() as UserEntity;

    expect(user.id).not.toBe('');
  });
});
