import { prisma } from '../../../../shared/infra/prisma/prismaClient';
import { ICredentialDTO } from '../entities/Credential';
import { ICredentialRepository } from './ICredentialRepository';

class CredentialRepository implements ICredentialRepository {
  async register({ vaultId, service, username, password }: ICredentialDTO): Promise<void> {
    await prisma.credential.create({
      data: {
        vaultId,
        service,
        username,
        password
      }
    });
  }

  async fetch(id: string): Promise<ICredentialDTO | null> {
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
}

export { CredentialRepository };
