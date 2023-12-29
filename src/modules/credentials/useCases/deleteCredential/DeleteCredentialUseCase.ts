import { inject, injectable } from 'tsyringe';

import { ICredentialRepository } from '../../infra/repositories/ICredentialRepository';

@injectable()
class DeleteCredentialUseCase {
  constructor(@inject('CredentialRepository') private credentialRepository: ICredentialRepository) {
    null;
  }

  async execute(id: string): Promise<void> {
    await this.credentialRepository.findByIdAndDelete(id);
  }
}

export { DeleteCredentialUseCase };
