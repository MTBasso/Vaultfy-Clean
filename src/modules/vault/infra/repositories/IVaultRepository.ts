import { IVaultDTO } from '../entities/Vault';
import { IVaultAndCredentialsDTO } from './VaultRepository';

interface IVaultRepository {
  register({ userId, name }: IVaultDTO): Promise<void>;
  findByIdAndListCredentials(id: string): Promise<IVaultAndCredentialsDTO | null>;
  findByIdAndUpdate(id: string, name: string): Promise<IVaultDTO | void>;
  findByIdAndDelete(id: string): Promise<void>;
}

export { IVaultRepository };
