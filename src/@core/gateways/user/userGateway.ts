import { UserEntity } from '@entities/user/UserEntity';

export interface IUserGateway {
  createUserGateway(user: UserEntity): Promise<void>;
  getUserByEmailGateway(email: string): Promise<UserEntity>;
}
