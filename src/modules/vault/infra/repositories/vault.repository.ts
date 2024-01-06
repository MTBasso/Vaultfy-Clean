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
    if (!userId || !name) throw new BadRequestError('Missing fields in request');
    const createdVault = await prisma.vault.create({
      data: {
        userId,
        name
      }
    });
    if (!createdVault) throw new InternalServerError('Error while creating vault');
    return createdVault;
  }

  async findByIdAndListCredentials(id: string): Promise<IVaultAndCredentialsDTO> {
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
    if (!vaultQuery) throw new NotFoundError('Vault not found');
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
    return vault[0];
  }

  async findByIdAndUpdate(id: string, name: string): Promise<IVaultDTO> {
    if (!id || !name) throw new BadRequestError('Missing fields in request');
    const updatedVault = await prisma.vault.update({
      where: { id },
      data: {
        name
      }
    });
    if (!updatedVault) throw new NotFoundError('Vault not found');
    return updatedVault;
  }

  async findByIdAndDelete(id: string): Promise<void> {
    await prisma.vault.delete({ where: { id } });
  }
}

export { VaultRepository };
