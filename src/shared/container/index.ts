import { container } from 'tsyringe';

import { CredentialRepository } from '../../modules/credentials/infra/repositories/credential.repository';
import { ICredentialRepository } from '../../modules/credentials/infra/repositories/credential.repository.interface';
import { UserRepository } from '../../modules/user/infra/repositories/user.repository';
import { IUserRepository } from '../../modules/user/infra/repositories/user.repository.interface';
import { RegisterUserUseCase } from '../../modules/user/useCases/registerUser/register-user.usecase';
import { IVaultRepository } from '../../modules/vault/infra/repositories/vault.repository.interface';
import { VaultRepository } from '../../modules/vault/infra/repositories/vault.repository';

container.register<IUserRepository>('UserRepository', { useClass: UserRepository });
container.register<IVaultRepository>('VaultRepository', { useClass: VaultRepository });
container.register<ICredentialRepository>('CredentialRepository', { useClass: CredentialRepository });

container.register<RegisterUserUseCase>('RegisterUserUseCase', { useClass: RegisterUserUseCase });
