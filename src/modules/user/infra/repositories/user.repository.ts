import { sign } from 'jsonwebtoken';

import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError
} from '../../../../shared/errors/Error';
import { prisma } from '../../../../shared/infra/prisma/prismaClient';
import { compareHash, generateSecret, hashString } from '../../../../utils/encryption';
import { IUserDTO } from '../entities/user.entity';
import { IUserRepository } from './user.repository.interface';

class UserRepository implements IUserRepository {
  async register({ username, email, password }: IUserDTO): Promise<IUserDTO> {
    try {
      if (!username || !email || !password) throw new BadRequestError('Missing fields in request');
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) throw new ConflictError('User with this email already exists');
      const hashedPassword = await hashString(password);
      const createdUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          secret: generateSecret(35)
        }
      });
      if (!createdUser) throw new InternalServerError('Error while creating the user');
      return createdUser;
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof InternalServerError || error instanceof ConflictError) {
        throw error;
      }
      throw new InternalServerError('Error while creating the user');
    }
  }

  async login({ email, password }: IUserDTO): Promise<string> {
    if (!email || !password) throw new BadRequestError('Missing fields in request');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError('User not found, this email is not in use yet');
    const passwordMatch = await compareHash(password, user.password);
    if (passwordMatch === false) throw new UnauthorizedError('Password is incorrect');
    const token = sign({ email }, 'SUPER-SECRET-KEY');
    if (!token) throw new InternalServerError('Error while generating the token');
    return token;
  }
}

export { UserRepository };
