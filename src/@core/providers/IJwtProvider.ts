import { UserEntity } from '@entities/user/UserEntity';

export interface IJwtProvider {
  sign(user: UserEntity): string;
}
