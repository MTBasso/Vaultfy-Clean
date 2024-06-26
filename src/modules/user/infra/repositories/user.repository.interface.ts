import { IUserDTO } from '../entities/user.entity';
import { IUserAndVaultsDTO } from './user.repository';

interface IUserRepository {
  register(user: IUserDTO): Promise<IUserDTO>;
  login(user: IUserDTO): Promise<string>;
  listVaults(inputId: string): Promise<IUserAndVaultsDTO>;
}

export { IUserRepository };
