import { IUserDTO } from '../entities/User';

interface IUserRepository {
  register(user: IUserDTO): Promise<void>;
  login(user: IUserDTO): Promise<string | null>;
}

export { IUserRepository };
