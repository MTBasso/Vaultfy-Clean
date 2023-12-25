import { inject, injectable } from 'tsyringe';

import { ICredentialDTO } from '../../infra/entities/Credential';
import { ICredentialRepository } from '../../infra/repositories/ICredentialRepository';

@injectable()
class FetchCredentialUseCase {
  constructor(@inject('CredentialRepository') private credentialRepository: ICredentialRepository) {
    null;
  }

  async execute(id: string): Promise<ICredentialDTO | null> {
    const fetchedCred = await this.credentialRepository.fetch(id);
    return fetchedCred;
  }
}

export { FetchCredentialUseCase };
