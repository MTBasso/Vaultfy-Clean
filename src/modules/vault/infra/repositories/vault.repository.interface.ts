import { IVaultDTO } from '../entities/vault.entity';
import { IVaultAndCredentialsDTO } from './vault.repository';

interface IVaultRepository {
  register({ userId, name }: IVaultDTO): Promise<IVaultDTO>;
  findByIdAndListCredentials(id: string): Promise<IVaultAndCredentialsDTO | null>;
  findByIdAndUpdate(id: string, name: string): Promise<IVaultDTO | void>;
  findByIdAndDelete(id: string): Promise<void>;
}

export { IVaultRepository };
