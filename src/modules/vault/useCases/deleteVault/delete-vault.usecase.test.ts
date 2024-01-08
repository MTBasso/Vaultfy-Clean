import { container } from 'tsyringe';

import { BadRequestError, NotFoundError } from '../../../../shared/errors/Error';
import { IVaultRepository } from '../../infra/repositories/vault.repository.interface';
import { DeleteVaultUseCase } from './delete-vault.usecase';

const vaultRepositoryMock: jest.Mocked<IVaultRepository> = {
  register: jest.fn(),
  findByIdAndListCredentials: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

container.register<IVaultRepository>('VaultRepository', { useValue: vaultRepositoryMock });

describe('delete-vault.usecase', () => {
  let deleteVaultUseCase: DeleteVaultUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    deleteVaultUseCase = container.resolve(DeleteVaultUseCase);
  });

  it('should delete a vault successfully', async () => {
    const vaultId = '123';

    await deleteVaultUseCase.execute(vaultId);

    expect(vaultRepositoryMock.findByIdAndDelete).toHaveBeenCalledWith(vaultId);
  });

  it('should throw BadRequestError when Id is missing', async () => {
    const missingId = '';

    try {
      await deleteVaultUseCase.execute(missingId);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
    }
  });

  it('should throw NotFoundError when vault is not found', async () => {
    const nonExistentVaultId = 'nonexistent';

    vaultRepositoryMock.findByIdAndDelete.mockRejectedValueOnce(new NotFoundError('Vault Not Found'));

    await expect(deleteVaultUseCase.execute(nonExistentVaultId)).rejects.toThrow(NotFoundError);

    expect(vaultRepositoryMock.findByIdAndDelete).toHaveBeenCalledWith(nonExistentVaultId);
  });
});
