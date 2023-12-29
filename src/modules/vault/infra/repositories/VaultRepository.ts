import { prisma } from '../../../../shared/infra/prisma/prismaClient';
import { IVaultDTO } from '../entities/Vault';
import { IVaultRepository } from './IVaultRepository';

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
  async register({ userId, name }: IVaultDTO): Promise<void> {
    await prisma.vault.create({
      data: {
        userId,
        name
      }
    });
  }

  async findByIdAndListCredentials(id: string): Promise<IVaultAndCredentialsDTO | null> {
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
    if (!vaultQuery) return null;
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

  async findByIdAndUpdate(id: string, name: string): Promise<IVaultDTO | void> {
    if (!name) return;
    const updatedVault = await prisma.vault.update({
      where: { id },
      data: {
        name
      }
    });
    return updatedVault;
  }

  async findByIdAndDelete(id: string): Promise<void> {
    await prisma.vault.delete({ where: { id } });
  }
}

export { VaultRepository };
