import { User } from '../../../user/infra/entities/user.entity';

export interface IVaultDTO {
  userId: string;
  name: string;
}

class Vault {
  id?: string;
  name!: string;
  credential?: string;
  User!: User;
  userId!: string;
}

export { Vault };
