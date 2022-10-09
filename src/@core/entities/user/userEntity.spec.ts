// test user entity

import { IUserEntityProps, UserEntity } from './UserEntity';
import { UserError } from './UserErrors';
import { Email } from '../valueObjects/EmailVO';
import { Password } from '../valueObjects/PasswordVO';

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
    const result = Password.create({ password: '' });

    if (result.isLeft()) {
      const error = result.value;
      expect(error.constructor).toBe(UserError.PasswordRequiredError);
      expect(error.getValue().message).toBe('Password is required');
    }
  });

  it('should throw error with invalid password', () => {
    const test1 = Password.create({ password: 'a'.repeat(256) });

    expect(test1.isLeft()).toBeTruthy();
    const error = test1.value as UserError.PasswordInvalidError;
    expect(error.constructor).toBe(UserError.PasswordInvalidError);
    expect(error.getValue().message).toBe('Password is invalid');

    const test2 = Password.create({ password: 'a'.repeat(2) });

    const error2 = test2.value as UserError.PasswordInvalidError;
    expect(error2.constructor).toBe(UserError.PasswordInvalidError);
    expect(error2.getValue().message).toBe('Password is invalid');
  });

  it('should throw error with invalid email', () => {
    const test1 = Email.create('a'.repeat(256));

    const error = test1.value as UserError.EmailInvalidError;
    expect(error.constructor).toBe(UserError.EmailInvalidError);
    expect(error.getValue().message).toBe('Email is invalid');

    const test2 = Email.create('invalid@');

    const error2 = test2.value as UserError.EmailInvalidError;
    expect(error2.constructor).toBe(UserError.EmailInvalidError);
    expect(error2.getValue().message).toBe('Email is invalid');

    const test3 = Email.create('invalid@invalid');

    const error3 = test3.value as UserError.EmailInvalidError;
    expect(error3.constructor).toBe(UserError.EmailInvalidError);
    expect(error3.getValue().message).toBe('Email is invalid');

    const test4 = Email.create('a'.repeat(2));

    const error4 = test4.value as UserError.EmailInvalidError;
    expect(error4.constructor).toBe(UserError.EmailInvalidError);
    expect(error4.getValue().message).toBe('Email is invalid');
  });

  it('should not create a user without name', () => {
    const userProps: IUserEntityProps = {
      id: 'id',
      name: '',
      email: Email.create('jonhdoe@gmail.com').value.getValue() as Email,
      password: Password.create({
        password: '12345',
      }).value.getValue() as Password,
    };

    const result = UserEntity.create(userProps);

    const error = result.value as UserError.NameRequiredError;
    expect(error.constructor).toBe(UserError.NameRequiredError);
    expect(error.getValue().message).toBe('Name is required');
  });

  it('should create a user', () => {
    const userProps: IUserEntityProps = {
      id: '8432742374823',
      name: 'john doe',
      email: Email.create('jonhdoe@gmail.com').value.getValue() as Email,
      password: Password.create({
        password: '12345',
      }).value.getValue() as Password,
    };

    const user = UserEntity.create(userProps).value.getValue() as UserEntity;

    expect(user.id).toBe('8432742374823');
    expect(user.name).toBe('john doe');
    expect(user.email.value).toBe('jonhdoe@gmail.com');
  });

  it('Should create an id when it was not informed', () => {
    const userProps: IUserEntityProps = {
      id: '',
      name: 'john doe',
      email: Email.create('johndoe@gmail.com').value.getValue() as Email,
      password: Password.create({
        password: '12345',
      }).value.getValue() as Password,
    };

    const user = UserEntity.create(userProps).value.getValue() as UserEntity;

    expect(user.id).not.toBe('');
  });

  it('Should compare emails', () => {
    const userProps: IUserEntityProps = {
      id: '',
      name: 'john doe',
      email: Email.create('johndoe@gmail.com').value.getValue() as Email,
      password: Password.create({
        password: '12345',
      }).value.getValue() as Password,
    };

    const newEmail = Email.create('johndoe@gmail.com').value.getValue() as Email;
    const user = UserEntity.create(userProps).value.getValue() as UserEntity;
    const diffEmail = Email.create('abcd@gmail.com').value.getValue() as Email;

    const result = user.email.equals(newEmail);
    const result2 = newEmail.equals(user.email);
    const diffEmailResponse = user.email.equals(diffEmail);

    expect(result).toBeTruthy();
    expect(result2).toBeTruthy();
    expect(diffEmailResponse).toBeFalsy();
  });
});
