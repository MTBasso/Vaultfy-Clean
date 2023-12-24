import { inject, injectable } from 'tsyringe';

import { IUserDTO } from '../../infra/entities/User';
import { IUserRepository } from '../../infra/repositories/IUserRepository';

@injectable()
class RegisterUserUseCase {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {
    null;
  }

  async execute({ username, email, password }: IUserDTO): Promise<void> {
    await this.userRepository.register({ username, email, password });
  }
}

export { RegisterUserUseCase };
