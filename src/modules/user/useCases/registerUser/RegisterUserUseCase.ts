import { inject, injectable } from 'tsyringe';

import { IUserDTO } from '../../infra/entities/User';
import { IUserRepository } from '../../infra/repositories/IUserRepository';

@injectable()
class RegisterUserUseCase {
  constructor(@inject('UserRepository') private readonly userRepository: IUserRepository) {
    null;
  }

  async execute(user: IUserDTO): Promise<void> {
    await this.userRepository.register(user);
  }
}

export { RegisterUserUseCase };
