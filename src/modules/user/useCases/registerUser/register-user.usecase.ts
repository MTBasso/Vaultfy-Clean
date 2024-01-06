import { inject, injectable } from 'tsyringe';

import { IUserDTO } from '../../infra/entities/user.entity';
import { IUserRepository } from '../../infra/repositories/user.repository.interface';

@injectable()
class RegisterUserUseCase {
  constructor(@inject('UserRepository') private readonly userRepository: IUserRepository) {
    null;
  }

  async execute(user: IUserDTO): Promise<IUserDTO> {
    const createdUser = await this.userRepository.register(user);
    return createdUser;
  }
}

export { RegisterUserUseCase };
