import { UserEntity } from '@entities/user/UserEntity';
import { Email } from '@entities/valueObjects/EmailVO';
import { IUserGateway } from '@gateways/user/userGateway';

export class InMemoryUser implements IUserGateway {
  public users: UserEntity[] = [];

  async createUserGateway(user: UserEntity): Promise<void> {
    this.users.push(user);
  }

  async getUserByEmailGateway(email: Email): Promise<UserEntity> {
    return this.users.find((user) => email.equals(user.email));
  }

  getAllUsersGateway(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
}
