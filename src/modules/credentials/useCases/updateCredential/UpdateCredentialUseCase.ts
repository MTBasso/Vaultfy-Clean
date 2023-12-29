import { inject, injectable } from 'tsyringe';

import { ICredentialDTO } from '../../infra/entities/Credential';
import { ICredentialRepository } from '../../infra/repositories/ICredentialRepository';

@injectable()
class UpdateCredentialUseCase {
  constructor(@inject('CredentialRepository') private credentialRepository: ICredentialRepository) {
    null;
  }

  async execute(id: string, credential: ICredentialDTO): Promise<void> {
    await this.credentialRepository.findByIdAndUpdate(id, credential);
  }
}

export { UpdateCredentialUseCase };
