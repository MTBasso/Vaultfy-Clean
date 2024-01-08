import { container } from 'tsyringe';

import { BadRequestError, InternalServerError } from '../../../../shared/errors/Error';
import { IVaultDTO } from '../../infra/entities/vault.entity';
import { IVaultRepository } from '../../infra/repositories/vault.repository.interface';
import { CreateVaultUseCase } from './create-vault.usecase';

const vaultRepositoryMock: jest.Mocked<IVaultRepository> = {
  register: jest.fn(),
  findByIdAndListCredentials: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

container.register<IVaultRepository>('VaultRepository', { useValue: vaultRepositoryMock });

describe('create-vault.usecase', () => {
  let createVaultUseCase: CreateVaultUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    createVaultUseCase = container.resolve(CreateVaultUseCase);
  });

  it('should create a new vault', async () => {
    const vaultData: IVaultDTO = { userId: '1', name: 'Test Vault' };
    vaultRepositoryMock.register.mockResolvedValueOnce(vaultData);

    const result = await createVaultUseCase.execute(vaultData);

    expect(vaultRepositoryMock.register).toHaveBeenCalledWith(vaultData);
    expect(result).toEqual(vaultData);
  });

  it('should throw BadRequestError when missing fields in request', async () => {
    const invalidVault: IVaultDTO = { userId: '', name: '' };

    try {
      await createVaultUseCase.execute(invalidVault);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
    }
  });

  it('should throw InternalServerError when repository fails', async () => {
    const mockedVault: IVaultDTO = { userId: 'mockedUserId', name: 'Mocked Vault' };

    vaultRepositoryMock.register.mockRejectedValueOnce(new InternalServerError('Repository Error'));

    await expect(createVaultUseCase.execute(mockedVault)).rejects.toThrow(InternalServerError);
  });
});
