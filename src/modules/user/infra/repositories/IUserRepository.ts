import { IUserDTO } from '../entities/User';

interface IUserRepository {
  register(user: IUserDTO): Promise<void>;
}

export { IUserRepository };
