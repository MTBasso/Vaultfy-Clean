import { container } from 'tsyringe';

import { UserRepository } from '../../modules/user/infra/repositories/UserRepository';
import { IUserRepository } from '../../modules/user/infra/repositories/IUserRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
