// test user entity

import { UserEntity, IUserEntityProps, Email, Password } from './UserEntity';

describe('UserEntity', () => {
  it('should throw error without email', () => {
    console.log(Email.create('dsad'));
    expect(Email.create('').error).toBe('Email is required');
  });

  it('should throw error without password', () => {
    expect(Password.create({ password: '', salt: '' }).error).toBe(
      'Password is required',
    );
  });

  it('should throw error with invalid password', () => {
    expect(Password.create({ password: 'a'.repeat(256), salt: '' }).error).toBe(
      'Password is invalid',
    );

    expect(Password.create({ password: 'a'.repeat(2), salt: '' }).error).toBe(
      'Password is invalid',
    );
  });

  it('should throw error with invalid email', () => {
    expect(Email.create('invalid').error).toBe('Email is invalid');

    expect(Email.create('invalid@').error).toBe('Email is invalid');

    expect(Email.create('invalid@invalid').error).toBe('Email is invalid');

    expect(Email.create('invalid@invalid.').error).toBe('Email is invalid');
    expect(Email.create('a'.repeat(256)).error).toBe('Email is invalid');

    expect(Email.create('a'.repeat(2)).error).toBe('Email is invalid');
  });

  it('should not create a user without name', () => {
    const userProps: IUserEntityProps = {
      id: 'id',
      name: '',
      email: Email.create('jonhdoe@gmail.com').getValue(),
      password: Password.create({ password: '12345', salt: '' }).getValue(),
    };

    expect(UserEntity.create(userProps).error).toBe('Name is required');
  });

  it('should create a user', () => {
    const userProps: IUserEntityProps = {
      id: '8432742374823',
      name: 'john doe',
      email: Email.create('jonhdoe@gmail.com').getValue(),
      password: Password.create({ password: '12345', salt: '' }).getValue(),
    };

    const user = UserEntity.create(userProps).getValue();

    expect(user.id).toBe('8432742374823');
    expect(user.name).toBe('john doe');
    expect(user.email.value).toBe('jonhdoe@gmail.com');
    expect(user.password.value).not.toBe('12345');
  });

  it('Should create user and crypto password', () => {
    const userProps: IUserEntityProps = {
      id: '8432742374823',
      name: 'john doe',
      email: Email.create('johndoe@gmail.com').getValue(),
      password: Password.create({ password: '12345', salt: '' }).getValue(),
    };

    const user = UserEntity.create(userProps);

    expect(user.getValue().password.value).not.toBe('12345');
  });

  it('Should compare password', () => {
    const userProps: IUserEntityProps = {
      id: '8432742374823',
      name: 'john doe',
      email: Email.create('johndoe@gmail.com').getValue(),
      password: Password.create({ password: '12345', salt: '' }).getValue(),
    };

    const user = UserEntity.create(userProps);

    expect(user.getValue().password.comparePassword('12345')).toBe(true);

    expect(user.getValue().password.comparePassword('123456')).toBe(false);
  });

  it('Should return true with salt', () => {
    const userProps: IUserEntityProps = {
      id: '8432742374823',
      name: 'john doe',
      email: Email.create('johndoe@gmail.com').getValue(),
      password: Password.create({
        password: '12345',
        salt: '4666d4544c08bcbd6306ef4b842b1b3f',
      }).getValue(),
    };

    const user = UserEntity.create(userProps);

    expect(user.getValue().password.comparePassword('12345')).toBe(true);
  });

  it('Should create an id when it was not informed', () => {
    const userProps: IUserEntityProps = {
      id: '',
      name: 'john doe',
      email: Email.create('johndoe@gmail.com').getValue(),
      password: Password.create({ password: '12345', salt: '' }).getValue(),
    };

    const user = UserEntity.create(userProps);

    expect(user.getValue().id).not.toBe('');
  });
});
