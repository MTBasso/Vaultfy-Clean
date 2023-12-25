import { sign } from 'jsonwebtoken';

import { prisma } from '../../../../shared/infra/prisma/prismaClient';
import { compareHash, generateSecret, hashString } from '../../../../utils/encryption';
import { IUserDTO } from '../entities/User';
import { IUserRepository } from './IUserRepository';

class UserRepository implements IUserRepository {
  async register({ username, email, password }: IUserDTO): Promise<void> {
    if (!username) throw new Error('Username is required');
    const hashedPassword = await hashString(password);
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        secret: generateSecret(35)
      }
    });
  }

  async login({ email, password }: IUserDTO): Promise<string | void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;
    const passwordMatch = await compareHash(password, user.password);
    if (passwordMatch === false) return;
    const token = sign({ userId: user.id }, 'SUPER-SECRET-KEY');
    return token;
  }
}

export { UserRepository };
