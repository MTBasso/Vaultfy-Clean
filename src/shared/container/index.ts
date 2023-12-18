import { container } from 'tsyringe';

import { IUserRepository } from '../../modules/user/infra/repositories/IUserRepository';
import { UserRepository } from '../../modules/user/infra/repositories/UserRepository';
// import { RegisterUserUseCase } from '../../modules/user/useCases/regiserUser/RegiserUserUseCase';

// container.register<IUserRepository>('UserRepository', { useClass: UserRepository });
container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
// const regiserUserUseCase = container.resolve(RegisterUserUseCase);
