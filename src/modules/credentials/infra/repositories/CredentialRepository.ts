import { ApiError, BadRequestError, NotFoundError } from '../../../../shared/errors/Error';
import { prisma } from '../../../../shared/infra/prisma/prismaClient';
import { ICredentialDTO } from '../entities/Credential';
import { ICredentialRepository } from './ICredentialRepository';

class CredentialRepository implements ICredentialRepository {
  async register({ vaultId, service, username, password }: ICredentialDTO): Promise<ICredentialDTO> {
    if (!vaultId || !service || !username || !password) throw new BadRequestError('Missing fields in request');
    const credential = await prisma.credential.create({
      data: {
        vaultId,
        service,
        username,
        password
      }
    });
    if (!credential) throw new ApiError('Error while creating credential', 500);
    return credential;
  }

  async findById(id: string): Promise<ICredentialDTO> {
    if (!id) throw new BadRequestError('Missing id in request');
    const credential = await prisma.credential.findUnique({
      where: {
        id
      }
    });
    if (!credential) throw new NotFoundError('Credential not found');
    return credential;
  }

  async findByIdAndUpdate(id: string, { service, username, password }: ICredentialDTO): Promise<ICredentialDTO> {
    if (!id || !service || !username || !password) throw new BadRequestError('Missing fields in request');
    const updatedCredential = await prisma.credential.update({
      where: { id },
      data: {
        service,
        username,
        password
      }
    });
    if (!updatedCredential) throw new NotFoundError('Credential not found');
    return updatedCredential;
  }

  async findByIdAndDelete(id: string): Promise<void> {
    if (!id) throw new BadRequestError('Missing id in request');
    await prisma.credential.delete({ where: { id } });
  }
}

export { CredentialRepository };
