import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { IVaultAndCredentialsDTO } from '../../infra/repositories/vault.repository';
import { FetchVaultController } from './fetch-vault.controller';
import { FetchVaultUseCase } from './fetch-vault.usecase';

jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn()
  }
}));

jest.mock('./fetch-vault.usecase', () => ({
  FetchVaultUseCase: jest.fn()
}));

describe('fetch-vault.controller', () => {
  let fetchVaultController: FetchVaultController;
  let fetchVaultUseCaseMock: jest.Mocked<FetchVaultUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    fetchVaultUseCaseMock = {
      execute: jest.fn()
    } as unknown as jest.Mocked<FetchVaultUseCase>;

    (container.resolve as jest.Mock).mockReturnValueOnce(fetchVaultUseCaseMock);
    fetchVaultController = new FetchVaultController();
  });

  it('should fetch a vault successfully and return JSON response', async () => {
    const mockVaultId = 'testVaultId';
    const mockVault: IVaultAndCredentialsDTO = {
      id: mockVaultId,
      name: 'TestVault Mock',
      userId: 'testUserId',
      credential: [
        { id: 'credId1', service: 'Service 1', username: 'User1' },
        { id: 'credId2', service: 'Service 2', username: 'User2' }
      ]
    };

    fetchVaultUseCaseMock.execute.mockResolvedValueOnce(mockVault);

    const mockRequest = {
      params: { id: mockVaultId }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await fetchVaultController.handle(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Vault Fetched Succesfully', vault: mockVault });
  });

  it('should handle internal server error and throw InternalServerError', async () => {
    fetchVaultUseCaseMock.execute.mockRejectedValueOnce(new InternalServerError('Some error'));

    const mockRequest = {
      params: { id: 'nonexistenttId' }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await fetchVaultController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should handle missing id in request and throw BadRequestError', async () => {
    const mockRequest = {
      params: { id: '' }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await fetchVaultController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should handle vault not found and throw NotFoundError', async () => {
    const mockVaultId = 'testVaultId';
    fetchVaultUseCaseMock.execute.mockRejectedValueOnce(new NotFoundError('Internal Server Error'));

    const mockRequest = {
      params: { id: mockVaultId }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await fetchVaultController.handle(mockRequest, mockResponse);
    } catch (error) {
      console.error(error);
      expect(error).toBeInstanceOf(NotFoundError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
