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

  async login({ email, password }: IUserDTO): Promise<string | null> {
    const token = sign({ email }, 'SUPER-SECRET-KEY');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const passwordMatch = await compareHash(password, user.password);
    if (passwordMatch === false) return null;
    return token;
  }

  async fetch(id: string): Promise<IUserDTO | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return user;
  }
}

export { UserRepository };
