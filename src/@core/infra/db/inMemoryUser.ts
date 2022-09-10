import { UserEntity } from '@entities/user/UserEntity';
import { IUserGateway } from '@gateways/user/userGateway';

export class InMemoryUser implements IUserGateway {
  private users: UserEntity[] = [];

  async createUserGateway(user: UserEntity): Promise<void> {
    this.users.push(user);
    console.log(this.users);
  }
}
