import { inject, injectable } from 'tsyringe';

import { ICredentialDTO } from '../../infra/entities/credential.entity';
import { ICredentialRepository } from '../../infra/repositories/credential.repository.interface';

@injectable()
class UpdateCredentialUseCase {
  constructor(@inject('CredentialRepository') private readonly credentialRepository: ICredentialRepository) {
    null;
  }

  async execute(id: string, credential: ICredentialDTO): Promise<ICredentialDTO> {
    const cred = await this.credentialRepository.findByIdAndUpdate(id, credential);
    return cred;
  }
}

export { UpdateCredentialUseCase };
