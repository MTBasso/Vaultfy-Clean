import { sign } from 'jsonwebtoken';

import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError
} from '../../../../shared/errors/Error';
import 'dotenv/config';
import { prisma } from '../../../../shared/infra/prisma/prismaClient';
import { compareHash, generateSecret, hashString } from '../../../../utils/encryption';
import { IUserDTO } from '../entities/user.entity';
import { IUserRepository } from './user.repository.interface';

export interface IUserAndVaultsDTO {
  id: string;
  username: string;
  email: string;
  vault: {
    id: string;
    name: string;
  }[];
}

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
      if (!createdUser) throw new InternalServerError('Internal Prisma Error');
      return createdUser;
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof InternalServerError || error instanceof ConflictError) {
        throw error;
      }
      throw new InternalServerError('Error while creating the user');
    }
  }

  async login({ email, password }: IUserDTO): Promise<string> {
    try {
      if (!email || !password) throw new BadRequestError('Missing fields in request');
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new NotFoundError('User not found, this email is not in use yet');
      const passwordMatch = await compareHash(password, user.password);
      if (passwordMatch === false) throw new UnauthorizedError('Password is incorrect');
      const token = sign({ email }, process.env.JWT_SECRET as string);
      return token;
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof UnauthorizedError)
        throw error;
      throw new InternalServerError('Internal Server Error');
    }
  }

  async listVaults(id: string): Promise<IUserAndVaultsDTO> {
    try {
      if (!id) throw new BadRequestError('Missing Id in request');
      const userQuery = await prisma.user.findMany({
        where: { id },
        include: {
          vault: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      if (!userQuery || userQuery === null) throw new NotFoundError('User not found');
      const user: IUserAndVaultsDTO[] = userQuery.map((originalItem) => {
        const { vault, ...rest } = originalItem;
        return {
          ...rest,
          vault: vault.map((vaultItem) => ({
            id: vaultItem.id,
            name: vaultItem.name
          }))
        };
      });
      if (!user || user === null) throw new NotFoundError('User not found');
      return user[0];
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) throw error;
      throw new InternalServerError('Internal Server Error');
    }
  }
}

export { UserRepository };
