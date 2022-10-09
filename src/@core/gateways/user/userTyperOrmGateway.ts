import { UserEntity } from '@entities/user/UserEntity';
import { Email } from '@entities/valueObjects/EmailVO';
import { Equal, Repository } from 'typeorm';
import { IUserGateway } from './userGateway';

export class UserTypeOrmGateway implements IUserGateway {
  constructor(private _ormRepository: Repository<UserEntity>) {}

  async createUserGateway(user: UserEntity): Promise<void> {
    await this._ormRepository.save(user);
  }
  getUserByEmailGateway(email: Email): Promise<UserEntity> {
    return this._ormRepository.findOne({
      where: { email: Equal(JSON.stringify(email)) },
    });
  }

  getAllUsersGateway(): Promise<UserEntity[]> {
    return this._ormRepository.find();
  }
}
