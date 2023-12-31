import { inject, injectable } from 'tsyringe';

import { IVaultRepository } from '../../infra/repositories/vault.repository.interface';

@injectable()
class DeleteVaultUseCase {
  constructor(@inject('VaultRepository') private vaultRepository: IVaultRepository) {
    null;
  }

  async execute(id: string): Promise<void> {
    await this.vaultRepository.findByIdAndDelete(id);
  }
}

export { DeleteVaultUseCase };
