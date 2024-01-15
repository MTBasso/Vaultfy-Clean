import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { prisma } from '../../../../shared/infra/prisma/prismaClient';
import { IVaultDTO } from '../entities/vault.entity';
import { IVaultRepository } from './vault.repository.interface';

export interface IVaultAndCredentialsDTO {
  id: string;
  name: string;
  userId: string;
  credential: {
    id: string;
    service: string;
    username: string;
  }[];
}

class VaultRepository implements IVaultRepository {
  async register({ userId, name }: IVaultDTO): Promise<IVaultDTO> {
    try {
      if (!userId || !name) throw new BadRequestError('Missing fields in request');
      const createdVault = await prisma.vault.create({
        data: {
          userId,
          name
        }
      });
      if (!createdVault) throw new InternalServerError('Error while creating vault');
      return createdVault;
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new InternalServerError('Error while creating vault');
    }
  }

  async findByIdAndListCredentials(id: string): Promise<IVaultAndCredentialsDTO> {
    try {
      if (!id) throw new BadRequestError('Missing id in request');
      const vaultQuery = await prisma.vault.findMany({
        where: { id },
        include: {
          credential: {
            where: {
              vaultId: id
            },
            select: {
              id: true,
              service: true,
              username: true
            }
          }
        }
      });
      if (!vaultQuery || vaultQuery === null) throw new NotFoundError('Vault not found');
      const vault: IVaultAndCredentialsDTO[] = vaultQuery.map((originalItem) => {
        const { credential, ...rest } = originalItem;
        return {
          ...rest,
          credential: credential.map((credItem) => ({
            id: credItem.id,
            service: credItem.service,
            username: credItem.username
          }))
        };
      });
      if (!vault || vault === null) throw new NotFoundError('Vault not found');
      return vault[0];
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) throw error;
      throw new InternalServerError('Internal Server Error');
    }
  }

  async findByIdAndUpdate(id: string, name: string): Promise<IVaultDTO> {
    try {
      if (!id || !name) throw new BadRequestError('Missing fields in request');
      const existingVault = await prisma.vault.findUnique({
        where: { id }
      });

      if (!existingVault) throw new NotFoundError('Vault not found');

      const updatedVault = await prisma.vault.update({
        where: { id },
        data: {
          name
        }
      });
      if (!updatedVault) throw new NotFoundError('Vault not found');
      return updatedVault;
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Internal Server Error');
    }
  }

  async findByIdAndDelete(id: string): Promise<void> {
    try {
      if (!id) throw new BadRequestError('Missing fields in request');
      try {
        await prisma.vault.delete({ where: { id } });
      } catch (error) {
        throw new NotFoundError('Vault not found');
      }
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError('Internal Server Error');
    }
  }
}

export { VaultRepository };
