import { UserEntity } from '@entities/user/UserEntity';
import { Email } from '@entities/valueObjects/EmailVO';

export interface IUserGateway {
  createUserGateway(user: UserEntity): Promise<void>;
  getUserByEmailGateway(email: Email): Promise<UserEntity>;
  getAllUsersGateway(): Promise<UserEntity[]>;
}
