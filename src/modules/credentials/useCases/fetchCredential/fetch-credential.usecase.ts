import { inject, injectable } from 'tsyringe';

import { ICredentialDTO } from '../../infra/entities/credential.entity';
import { ICredentialRepository } from '../../infra/repositories/credential.repository.interface';

@injectable()
class FetchCredentialUseCase {
  constructor(@inject('CredentialRepository') private readonly credentialRepository: ICredentialRepository) {
    null;
  }

  async execute(id: string): Promise<ICredentialDTO> {
    const fetchedCredential = await this.credentialRepository.findById(id);
    return fetchedCredential;
  }
}

export { FetchCredentialUseCase };
