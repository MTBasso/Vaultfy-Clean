import { inject, injectable } from 'tsyringe';

// import { IVaultDTO } from '../../infra/entities/Vault';
import { IVaultRepository } from '../../infra/repositories/vault.repository.interface';

@injectable()
class FetchVaultUseCase {
  constructor(@inject('VaultRepository') private vaultRepository: IVaultRepository) {
    null;
  }

  async execute(id: string): Promise<object | null> {
    const vault = await this.vaultRepository.findByIdAndListCredentials(id);
    if (!vault) return null;
    return vault;
  }
}

export { FetchVaultUseCase };
