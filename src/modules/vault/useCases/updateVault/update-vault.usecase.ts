import { inject, injectable } from 'tsyringe';

import { IVaultDTO } from '../../infra/entities/vault.entity';
import { IVaultRepository } from '../../infra/repositories/vault.repository.interface';

@injectable()
class UpdateVaultUseCase {
  constructor(@inject('VaultRepository') private vaultRepository: IVaultRepository) {
    null;
  }

  async execute(id: string, name: string): Promise<IVaultDTO> {
    const updatedVault = await this.vaultRepository.findByIdAndUpdate(id, name);
    return updatedVault;
  }
}

export { UpdateVaultUseCase };
