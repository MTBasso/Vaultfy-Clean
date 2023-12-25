import { ICredentialDTO } from '../entities/Credential';

interface ICredentialRepository {
  register(credential: ICredentialDTO): Promise<void>;
  fetch(id: string): Promise<ICredentialDTO | null>;
}

export { ICredentialRepository };
