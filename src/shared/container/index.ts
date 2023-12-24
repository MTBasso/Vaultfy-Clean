import { container } from 'tsyringe';

import { IUserRepository } from '../../modules/user/infra/repositories/IUserRepository';
import { UserRepository } from '../../modules/user/infra/repositories/UserRepository';
import { IVaultRepository } from '../../modules/vault/infra/repositories/IVaultRepository';
import { VaultRepository } from '../../modules/vault/infra/repositories/VaultRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IVaultRepository>('VaultRepository', VaultRepository);
