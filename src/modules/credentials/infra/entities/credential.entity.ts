import { Vault } from '../../../vault/infra/entities/vault.entity';

export interface ICredentialDTO {
  id?: string;
  vaultId?: string;
  service: string;
  username: string;
  password: string;
}

class Credential {
  id?: string;
  service!: string;
  username!: string;
  password!: string;
  Vault!: Vault;
  vaultId!: string;
}

export { Credential };
