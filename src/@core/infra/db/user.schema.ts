import { UserEntity } from '@entities/user/UserEntity';
import { EntitySchema } from 'typeorm';

export const UserSchema = new EntitySchema<UserEntity>({
  name: 'User',
  target: UserEntity,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
    },
    name: {
      type: String,
    },
    email: {
      type: 'simple-json',
    },
    password: {
      type: 'simple-json',
    },
  },
});
