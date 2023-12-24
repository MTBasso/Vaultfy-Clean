import { IVaultDTO } from '../entities/Vault';

interface IVaultRepository {
  register({ userId, name }: IVaultDTO): Promise<void>;
}

export { IVaultRepository };
