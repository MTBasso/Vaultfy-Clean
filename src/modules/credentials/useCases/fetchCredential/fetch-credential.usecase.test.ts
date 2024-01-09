import { container } from 'tsyringe';

import { NotFoundError } from '../../../../shared/errors/Error';
import { ICredentialDTO } from '../../infra/entities/credential.entity';
import { ICredentialRepository } from '../../infra/repositories/credential.repository.interface';
import { FetchCredentialUseCase } from './fetch-credential.usecase';

const credentialRepositoryMock: jest.Mocked<ICredentialRepository> = {
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  register: jest.fn()
};

container.register<ICredentialRepository>('CredentialRepository', { useValue: credentialRepositoryMock });

describe('fetch-credential.usecase', () => {
  let fetchCredentialUseCase: FetchCredentialUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    fetchCredentialUseCase = container.resolve(FetchCredentialUseCase);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch a credential by id', async () => {
    const mockCredentialId = 'mockedCredentialId';
    const mockedCredential: ICredentialDTO = {
      id: mockCredentialId,
      vaultId: 'mockedVaultId',
      service: 'Mocked Service',
      username: 'Mocked Username',
      password: 'Mocked Password'
    };

    credentialRepositoryMock.findById.mockResolvedValueOnce(mockedCredential);

    const result = await fetchCredentialUseCase.execute(mockCredentialId);

    expect(credentialRepositoryMock.findById).toHaveBeenCalledWith(mockCredentialId);
    expect(result).toEqual(mockedCredential);
  });

  it('should handle credential not found error and throw NotFoundError', async () => {
    const mockCredentialId = 'mockedCredentialId';
    credentialRepositoryMock.findById.mockRejectedValueOnce(new NotFoundError('Vault not found'));

    await expect(fetchCredentialUseCase.execute(mockCredentialId)).rejects.toThrow(NotFoundError);
  });
});
