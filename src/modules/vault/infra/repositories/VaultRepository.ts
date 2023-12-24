import { prisma } from '../../../../shared/infra/prisma/prismaClient';
// import { User } from '../../../user/infra/entities/User';
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
}

export { VaultRepository };
