import { IUserDTO } from '../entities/user.entity';

interface IUserRepository {
  register(user: IUserDTO): Promise<IUserDTO>;
  login(user: IUserDTO): Promise<string>;
}

export { IUserRepository };
