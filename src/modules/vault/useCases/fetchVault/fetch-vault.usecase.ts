import { inject, injectable } from 'tsyringe';

import { BadRequestError, NotFoundError } from '../../../../shared/errors/Error';
import { IVaultAndCredentialsDTO } from '../../infra/repositories/vault.repository';
import { IVaultRepository } from '../../infra/repositories/vault.repository.interface';

@injectable()
class FetchVaultUseCase {
  constructor(@inject('VaultRepository') private vaultRepository: IVaultRepository) {
    null;
  }

  async execute(id: string): Promise<IVaultAndCredentialsDTO> {
    if (!id) throw new BadRequestError('Missing id in request');
    const vault = await this.vaultRepository.findByIdAndListCredentials(id);
    if (!vault || vault === null) throw new NotFoundError('Vault not found');
    return vault;
  }
}

export { FetchVaultUseCase };
