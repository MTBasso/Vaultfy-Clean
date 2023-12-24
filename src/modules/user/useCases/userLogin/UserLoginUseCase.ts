import { inject, injectable } from 'tsyringe';

import { IUserDTO } from '../../infra/entities/User';
import { IUserRepository } from '../../infra/repositories/IUserRepository';

@injectable()
class UserLoginUseCase {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {
    null;
  }

  async execute({ email, password }: IUserDTO): Promise<void | string> {
    const token = await this.userRepository.login({ email, password });
    return token;
  }
}

export { UserLoginUseCase };
