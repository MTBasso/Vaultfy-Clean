import { inject, injectable } from 'tsyringe';

import { BadRequestError, NotFoundError } from '../../../../shared/errors/Error';
import { ICredentialDTO } from '../../infra/entities/credential.entity';
import { ICredentialRepository } from '../../infra/repositories/credential.repository.interface';

@injectable()
class UpdateCredentialUseCase {
  constructor(@inject('CredentialRepository') private readonly credentialRepository: ICredentialRepository) {
    null;
  }

  async execute(id: string, credential: ICredentialDTO): Promise<ICredentialDTO> {
    if (!credential.service && !credential.username && !credential.password)
      throw new BadRequestError('At least one of the fields (service, username, password) is required for updating.');
    const updatedCredential = await this.credentialRepository.findByIdAndUpdate(id, credential);
    if (!updatedCredential) throw new NotFoundError('Credential not found');
    return updatedCredential;
  }
}

export { UpdateCredentialUseCase };
