import { container } from 'tsyringe';

import { BadRequestError, InternalServerError } from '../../../../shared/errors/Error';
import { ICredentialDTO } from '../../infra/entities/credential.entity';
import { ICredentialRepository } from '../../infra/repositories/credential.repository.interface';
import { CreateCredentialUseCase } from './create-credential.usecase';

const credentialRepositoryMock: jest.Mocked<ICredentialRepository> = {
  register: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

container.register<ICredentialRepository>('CredentialRepository', { useValue: credentialRepositoryMock });

describe('create-credential.usecase', () => {
  let createCredentialUseCase: CreateCredentialUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    createCredentialUseCase = container.resolve(CreateCredentialUseCase);
  });

  it('should create a new credential', async () => {
    const credentialData: ICredentialDTO = {
      service: 'Mock Service',
      username: 'MockUsername',
      password: 'MockPassword'
    };

    credentialRepositoryMock.register.mockResolvedValueOnce(credentialData);

    const result = await createCredentialUseCase.execute(credentialData);

    expect(credentialRepositoryMock.register).toHaveBeenCalledWith(credentialData);
    expect(result).toEqual(credentialData);
  });

  it('should throw BadRequestError when missing fields in request', async () => {
    const invalidCredential: ICredentialDTO = {
      vaultId: '',
      service: '',
      username: '',
      password: ''
    };

    try {
      await createCredentialUseCase.execute(invalidCredential);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
    }
  });

  it('should throw InternalServerError when repository fails', async () => {
    const mockedCredential: ICredentialDTO = {
      vaultId: 'mockedVaultId',
      service: 'Mocked Service',
      username: 'Mocked User',
      password: 'Mocked Password'
    };

    credentialRepositoryMock.register.mockRejectedValueOnce(new InternalServerError('Repository Error'));
    await expect(createCredentialUseCase.execute(mockedCredential)).rejects.toThrow(InternalServerError);
  });
});
