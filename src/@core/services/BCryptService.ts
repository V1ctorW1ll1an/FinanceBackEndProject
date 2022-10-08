import bcrypt from 'bcrypt';
import { ICryptoService } from './ICryptoService';

export class BCryptService implements ICryptoService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
