import { container } from 'tsyringe';

import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { IVaultDTO } from '../../infra/entities/vault.entity';
import { IVaultRepository } from '../../infra/repositories/vault.repository.interface';
import { UpdateVaultUseCase } from './update-vault.usecase';

const vaultRepositoryMock: jest.Mocked<IVaultRepository> = {
  register: jest.fn(),
  findByIdAndListCredentials: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

container.register<IVaultRepository>('VaultRepository', { useValue: vaultRepositoryMock });

describe('update-vault.usecase', () => {
  let updateVaultUseCase: UpdateVaultUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    updateVaultUseCase = container.resolve(UpdateVaultUseCase);
  });

  it('should update an existing vault', async () => {
    const existingVaultId = 'existingVaultId';
    const updatedVaultName = 'Updated Vault Name';
    const updatedVault: IVaultDTO = { id: existingVaultId, name: updatedVaultName };

    vaultRepositoryMock.findByIdAndUpdate.mockResolvedValueOnce(updatedVault);

    const result = await updateVaultUseCase.execute(existingVaultId, updatedVaultName);

    expect(vaultRepositoryMock.findByIdAndUpdate).toHaveBeenCalledWith(existingVaultId, updatedVaultName);
    expect(result).toEqual(updatedVault);
  });

  it('should throw BadRequestError when missing fields in request', async () => {
    const invalidVaultId = '';
    const updatedVaultName = 'Updated Vault Name';

    try {
      await updateVaultUseCase.execute(invalidVaultId, updatedVaultName);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
    }
  });

  it('should throw NotFoundError when updating a non-exisint vault', async () => {
    const nonExistingVaultId = 'nonExistingVaultId';
    const updatedVaultName = 'Updated Vault Name';

    vaultRepositoryMock.findByIdAndUpdate.mockRejectedValueOnce(new NotFoundError('Vault not found'));

    try {
      await updateVaultUseCase.execute(nonExistingVaultId, updatedVaultName);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  it('should throw InternalServerError when repository fails', async () => {
    const existingVaultId = 'existingVaultId';
    const updatedVaultName = 'Updated Vault Name';

    vaultRepositoryMock.findByIdAndUpdate.mockRejectedValueOnce(new InternalServerError('Some error'));

    try {
      await updateVaultUseCase.execute(existingVaultId, updatedVaultName);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
    }
  });
});
