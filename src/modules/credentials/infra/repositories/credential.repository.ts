import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { prisma } from '../../../../shared/infra/prisma/prismaClient';
import { ICredentialDTO } from '../entities/credential.entity';
import { ICredentialRepository } from './credential.repository.interface';

class CredentialRepository implements ICredentialRepository {
  async register({ vaultId, service, username, password }: ICredentialDTO): Promise<ICredentialDTO> {
    try {
      if (!vaultId || !service || !username || !password) throw new BadRequestError('Missing fields in request');
      const credential = await prisma.credential.create({
        data: {
          vaultId,
          service,
          username,
          password
        }
      });
      return credential;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError('Internal Server Error');
    }
  }

  async findById(id: string): Promise<ICredentialDTO> {
    try {
      if (!id) throw new BadRequestError('Missing id in request');
      const credential = await prisma.credential.findUnique({
        where: {
          id
        }
      });
      if (!credential || credential === null) throw new NotFoundError('Credential not found');
      return credential;
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Internal Server Error');
    }
  }

  async findByIdAndUpdate(id: string, { service, username, password }: ICredentialDTO): Promise<ICredentialDTO> {
    try {
      if (!id) throw new BadRequestError('Missing id in request');
      const existingCredential = await prisma.credential.findUnique({
        where: { id }
      });
      if (!existingCredential) throw new NotFoundError('Credential not found');
      const updatedCredential = await prisma.credential.update({
        where: { id },
        data: {
          service,
          username,
          password
        }
      });
      return updatedCredential;
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Internal Server Error');
    }
  }

  async findByIdAndDelete(id: string): Promise<void> {
    try {
      if (!id) throw new BadRequestError('Missing id in request');
      await prisma.credential.delete({ where: { id } });
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError('Internal Server Error');
    }
  }
}

export { CredentialRepository };
