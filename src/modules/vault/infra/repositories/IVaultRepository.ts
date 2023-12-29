import { IVaultDTO } from '../entities/Vault';

interface IVaultRepository {
  register({ userId, name }: IVaultDTO): Promise<void>;
  fetch(id: string): Promise<object | null>;
}

export { IVaultRepository };
