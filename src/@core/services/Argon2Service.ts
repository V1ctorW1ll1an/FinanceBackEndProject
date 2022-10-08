import argon2 from 'argon2';
import { ICryptoService } from './ICryptoService';

export class Argon2Service implements ICryptoService {
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      hashLength: 140,
    });
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
  }
}
