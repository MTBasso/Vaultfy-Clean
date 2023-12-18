import { prisma } from '../../../../shared/infra/prisma/prismaClient';
import { generateSecret, hashString } from '../../../../utils/encryption';
import { IUserDTO } from '../entities/User';
import { IUserRepository } from './IUserRepository';

class UserRepository implements IUserRepository {
  async register({ username, email, password }: IUserDTO): Promise<void> {
    const hashedPassword = await hashString(password);
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        secret: generateSecret()
      }
    });
  }
}

export { UserRepository };
