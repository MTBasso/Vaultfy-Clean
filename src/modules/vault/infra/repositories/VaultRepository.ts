import { prisma } from '../../../../shared/infra/prisma/prismaClient';
import { IVaultDTO } from '../entities/Vault';
import { IVaultRepository } from './IVaultRepository';

class VaultRepository implements IVaultRepository {
  async register({ userId, name }: IVaultDTO): Promise<void> {
    await prisma.vault.create({
      data: {
        userId,
        name
      }
    });
  }

  async fetch(id: string): Promise<object | null> {
    const vault = await prisma.vault.findMany({
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
    if (!vault) return null;
    return vault;
  }

  // async update({ }) { }

  // async destroy({ }) { }
}

export { VaultRepository };
