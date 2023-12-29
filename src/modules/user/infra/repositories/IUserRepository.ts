import { IUserDTO } from '../entities/User';

interface IUserRepository {
  register(user: IUserDTO): Promise<IUserDTO>;
  login(user: IUserDTO): Promise<string>;
}

export { IUserRepository };
