import { inject, injectable } from 'tsyringe';

// import { IVaultDTO } from '../../infra/entities/Vault';
import { IVaultRepository } from '../../infra/repositories/IVaultRepository';

@injectable()
class FetchVaultUseCase {
  constructor(@inject('VaultRepository') private vaultRepository: IVaultRepository) {
    null;
  }

  async execute(id: string): Promise<object | null> {
    const vault = await this.vaultRepository.fetch(id);
    if (!vault) return null;
    return vault;
  }
}

export { FetchVaultUseCase };
