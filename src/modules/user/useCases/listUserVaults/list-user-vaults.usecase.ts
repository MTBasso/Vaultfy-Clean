import { inject, injectable } from 'tsyringe';

import { IUserAndVaultsDTO } from '../../infra/repositories/user.repository';
import { IUserRepository } from '../../infra/repositories/user.repository.interface';

@injectable()
class ListUserVaultsUseCase {
  constructor(@inject('UserRepository') private readonly userRepository: IUserRepository) {
    null;
  }

  async execute(id: string): Promise<IUserAndVaultsDTO> {
    const userVaults = await this.userRepository.listVaults(id);
    return userVaults;
  }
}

export { ListUserVaultsUseCase };
