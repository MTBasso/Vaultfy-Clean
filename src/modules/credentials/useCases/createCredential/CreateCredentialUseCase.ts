import { inject, injectable } from 'tsyringe';

import { ICredentialDTO } from '../../infra/entities/Credential';
import { ICredentialRepository } from '../../infra/repositories/ICredentialRepository';

@injectable()
class CreateCredentialUseCase {
  constructor(@inject('CredentialRepository') private credentialRepository: ICredentialRepository) {
    null;
  }

  async execute(credential: ICredentialDTO): Promise<void> {
    await this.credentialRepository.register(credential);
  }
}

export { CreateCredentialUseCase };
