import { UserEntity } from '@entities/user/UserEntity';
import jwt from 'jsonwebtoken';
import { IJwtProvider } from './IJwtProvider';

export class JwtProvider implements IJwtProvider {
  private readonly _secret: string;

  constructor(secret?: string) {
    this._secret = secret || 'secret';
  }

  sign(user: UserEntity): string {
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email.value,
      },
      this._secret,
      {
        expiresIn: '1d',
      },
    );

    return token;
  }
}
