import { inject, injectable } from 'tsyringe';

import { IVaultRepository } from '../../infra/repositories/IVaultRepository';

@injectable()
class UpdateVaultUseCase {
  constructor(@inject('VaultRepository') private vaultRepository: IVaultRepository) {
    null;
  }

  async execute(id: string, name: string): Promise<void> {
    await this.vaultRepository.findByIdAndUpdate(id, name);
  }
}

export { UpdateVaultUseCase };
