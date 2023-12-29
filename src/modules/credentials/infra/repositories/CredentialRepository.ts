import { prisma } from '../../../../shared/infra/prisma/prismaClient';
import { ICredentialDTO } from '../entities/Credential';
import { ICredentialRepository } from './ICredentialRepository';

class CredentialRepository implements ICredentialRepository {
  async register({ vaultId, service, username, password }: ICredentialDTO): Promise<void> {
    if (!vaultId) return;
    await prisma.credential.create({
      data: {
        vaultId,
        service,
        username,
        password
      }
    });
  }

  async findById(id: string): Promise<ICredentialDTO | null> {
    try {
      const credential = await prisma.credential.findUnique({
        where: {
          id
        }
      });
      return credential;
    } catch {
      return null;
    }
  }

  async findByIdAndUpdate(id: string, { service, username, password }: ICredentialDTO): Promise<ICredentialDTO> {
    const updatedCredential = await prisma.credential.update({
      where: { id },
      data: {
        service,
        username,
        password
      }
    });
    return updatedCredential;
  }

  async findByIdAndDelete(id: string): Promise<void> {
    await prisma.credential.delete({ where: { id } });
  }
}

export { CredentialRepository };
