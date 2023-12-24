import { inject, injectable } from 'tsyringe';

import { IVaultDTO } from '../../infra/entities/Vault';
import { IVaultRepository } from '../../infra/repositories/IVaultRepository';

@injectable()
class CreateVaultUseCase {
  constructor(@inject('VaultRepository') private vaultRepository: IVaultRepository) {
    null;
  }

  async execute({ userId, name }: IVaultDTO): Promise<void> {
    await this.vaultRepository.register({ userId, name });
  }
}

export { CreateVaultUseCase };
