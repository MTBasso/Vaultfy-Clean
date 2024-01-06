import { ICredentialDTO } from '../entities/credential.entity';

interface ICredentialRepository {
  register(credential: ICredentialDTO): Promise<ICredentialDTO>;
  findById(id: string): Promise<ICredentialDTO>;
  findByIdAndUpdate(id: string, { service, username, password }: ICredentialDTO): Promise<ICredentialDTO>;
  findByIdAndDelete(id: string): Promise<void>;
}

export { ICredentialRepository };
