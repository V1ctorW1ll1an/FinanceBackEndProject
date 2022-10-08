import bcrypt from 'bcrypt';
import { ICryptoProvider } from './ICryptoProvider';

export class BCryptProvider implements ICryptoProvider {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
