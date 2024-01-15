import { container } from 'tsyringe';

import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { IVaultAndCredentialsDTO } from '../../infra/repositories/vault.repository';
import { IVaultRepository } from '../../infra/repositories/vault.repository.interface';
import { FetchVaultUseCase } from './fetch-vault.usecase';

const vaultRepositoryMock: jest.Mocked<IVaultRepository> = {
  register: jest.fn(),
  findByIdAndListCredentials: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

container.register<IVaultRepository>('VaultRepository', { useValue: vaultRepositoryMock });

describe('fetch-vault.usecase', () => {
  let fetchVaultUseCase: FetchVaultUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    fetchVaultUseCase = container.resolve(FetchVaultUseCase);
  });

  it('should fetch a vault with credentials successfully', async () => {
    const vaultId = 'testVaultId';
    const mockedVault: IVaultAndCredentialsDTO = {
      id: vaultId,
      name: 'TestVault Mock',
      userId: 'testUserId',
      credential: [
        { id: 'cred1', service: 'Service 1', username: 'User1' },
        { id: 'cred2', service: 'Service 2', username: 'User2' }
      ]
    };

    vaultRepositoryMock.findByIdAndListCredentials.mockResolvedValueOnce(mockedVault);

    const result = await fetchVaultUseCase.execute(vaultId);

    expect(vaultRepositoryMock.findByIdAndListCredentials).toHaveBeenCalledWith(vaultId);
    expect(result).toEqual(mockedVault);
  });

  it('should throw a BadRequestError when missing id in request', async () => {
    try {
      await fetchVaultUseCase.execute('');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
    }
  });

  it('should throw NotFoundError when vault is not found', async () => {
    vaultRepositoryMock.findByIdAndListCredentials.mockRejectedValueOnce(new NotFoundError('Vault not found'));

    await expect(fetchVaultUseCase.execute('nonExistentVaultId')).rejects.toThrow(NotFoundError);
  });

  it('should throw InternalServerError when repository fails', async () => {
    vaultRepositoryMock.findByIdAndListCredentials.mockRejectedValueOnce(new InternalServerError('Some error'));

    await expect(fetchVaultUseCase.execute('testVaultId')).rejects.toThrow(InternalServerError);
  });
});
