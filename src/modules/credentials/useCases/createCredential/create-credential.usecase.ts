import { inject, injectable } from 'tsyringe';

import { ICredentialDTO } from '../../infra/entities/credential.entity';
import { ICredentialRepository } from '../../infra/repositories/credential.repository.interface';

@injectable()
class CreateCredentialUseCase {
  constructor(@inject('CredentialRepository') private readonly credentialRepository: ICredentialRepository) {
    null;
  }

  async execute(credential: ICredentialDTO): Promise<ICredentialDTO> {
    return await this.credentialRepository.register(credential);
  }
}

export { CreateCredentialUseCase };
