import { IVaultDTO } from '../entities/Vault';

interface IVaultRepository {
  register(vault: IVaultDTO): Promise<void>;
}

export { IVaultRepository };
