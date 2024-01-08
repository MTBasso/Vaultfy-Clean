import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError } from '../../../../shared/errors/Error';
import { DeleteVaultController } from './delete-vault.controller';
import { DeleteVaultUseCase } from './delete-vault.usecase';

jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn()
  }
}));

jest.mock('./delete-vault.usecase', () => ({
  DeleteVaultUseCase: jest.fn()
}));

describe('delete-vault.controller', () => {
  let deleteVaultController: DeleteVaultController;
  let deleteVaultUseCaseMock: jest.Mocked<DeleteVaultUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    deleteVaultUseCaseMock = {
      execute: jest.fn()
    } as unknown as jest.Mocked<DeleteVaultUseCase>;

    (container.resolve as jest.Mock).mockReturnValueOnce(deleteVaultUseCaseMock);
    deleteVaultController = new DeleteVaultController();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should handle vault deletion successfully and return JSON response', async () => {
    const vaultId = 'testVaultId';
    const mockRequest = {
      params: { id: vaultId }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await deleteVaultController.handle(mockRequest, mockResponse);
    expect(deleteVaultUseCaseMock.execute).toHaveBeenCalledWith(vaultId);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Vault deleted successfully' });
  });

  it('should handle vault deletion error and throw BadRequestError', async () => {
    const vaultId = 'testVaultId';
    deleteVaultUseCaseMock.execute.mockRejectedValueOnce(new BadRequestError('Missing id in request'));

    const mockRequest = {
      params: { id: vaultId }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await deleteVaultController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
