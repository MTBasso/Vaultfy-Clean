import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { UpdateVaultController } from './update-vault.controller';
import { UpdateVaultUseCase } from './update-vault.usecase';

jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn()
  }
}));

jest.mock('./update-vault.usecase', () => ({
  UpdateVaultUseCase: jest.fn()
}));

describe('update-vault.controller', () => {
  let updateVaultController: UpdateVaultController;
  let updateVaultUseCaseMock: jest.Mocked<UpdateVaultUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    updateVaultUseCaseMock = {
      execute: jest.fn()
    } as unknown as jest.Mocked<UpdateVaultUseCase>;

    (container.resolve as jest.Mock).mockReturnValueOnce(updateVaultUseCaseMock);
    updateVaultController = new UpdateVaultController();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should handle vault update successfully and return JSON response', async () => {
    const existingVaultId = 'existingVaultId';
    const updatedVaultName = 'Updated Vault Name';

    const mockRequest = {
      params: { id: existingVaultId },
      body: { name: updatedVaultName }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await updateVaultController.handle(mockRequest, mockResponse);

    expect(updateVaultUseCaseMock.execute).toHaveBeenCalledWith(existingVaultId, updatedVaultName);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Vault Updated' });
  });

  it('should handle vault update error and throw InternalServerError', async () => {
    const existingVaultId = 'existingVaultId';
    const updatedVaultName = 'Updated Vault Name';
    updateVaultUseCaseMock.execute.mockRejectedValueOnce(new InternalServerError('Some error'));

    const mockRequest = {
      params: { id: existingVaultId },
      body: { name: updatedVaultName }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await updateVaultController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should handle vault not found and throw NotFoundError', async () => {
    const nonExistingVaultId = 'nonExistingVaultId';
    const updatedVaultName = 'Updated Vault Name';
    updateVaultUseCaseMock.execute.mockRejectedValueOnce(new NotFoundError('Vault not found'));

    const mockRequest = {
      params: { id: nonExistingVaultId },
      body: { name: updatedVaultName }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await updateVaultController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should handle invalid request and throw BadRequestError', async () => {
    const invalidVaultId = '';
    const updatedVaultName = 'Updated Vault Name';

    const mockRequest = {
      params: { id: invalidVaultId },
      body: { name: updatedVaultName }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await expect(updateVaultController.handle(mockRequest, mockResponse)).rejects.toThrow(BadRequestError);
    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
