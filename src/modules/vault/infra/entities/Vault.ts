export interface IVaultDTO {
  name: string;
}

class Vault {
  id?: string;
  name!: string;
  credential?: string;
  User!: string;
  userId!: string;
}

export { Vault };
