import { inject, injectable } from 'tsyringe';

import { IVaultDTO } from '../../infra/entities/vault.entity';
import { IVaultRepository } from '../../infra/repositories/vault.repository.interface';

@injectable()
class CreateVaultUseCase {
  constructor(@inject('VaultRepository') private readonly vaultRepository: IVaultRepository) {
    null;
  }

  async execute(vault: IVaultDTO): Promise<IVaultDTO> {
    const createdVault = await this.vaultRepository.register(vault);
    return createdVault;
  }
}

export { CreateVaultUseCase };
