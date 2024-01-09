import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import { DeleteCredentialController } from './delete-credential.controller';
import { DeleteCredentialUseCase } from './delete-credential.usecase';

jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn()
  }
}));

jest.mock('./delete-credential.usecase', () => ({
  DeleteCredentialUseCase: jest.fn()
}));

describe('delete-credential.controller', () => {
  let deleteCredentialController: DeleteCredentialController;
  let deleteCredentialUseCaseMock: jest.Mocked<DeleteCredentialUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    deleteCredentialUseCaseMock = {
      execute: jest.fn()
    } as unknown as jest.Mocked<DeleteCredentialUseCase>;

    (container.resolve as jest.Mock).mockReturnValueOnce(deleteCredentialUseCaseMock);
    deleteCredentialController = new DeleteCredentialController();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should delete a credential and return JSON response', async () => {
    const mockCredentialId = 'mockedCredentialId';
    deleteCredentialUseCaseMock.execute.mockResolvedValueOnce();

    const mockRequest = {
      params: { id: mockCredentialId }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await deleteCredentialController.handle(mockRequest, mockResponse);

    expect(deleteCredentialUseCaseMock.execute).toHaveBeenCalledWith(mockCredentialId);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Credential deleted succesfully' });
  });

  it('should handle credential deletion error and throw InternalServerError', async () => {
    const mockCredentialId = 'mockedCredentialId';
    deleteCredentialUseCaseMock.execute.mockRejectedValueOnce(new InternalServerError('Some error'));

    const mockRequest = {
      params: { id: mockCredentialId }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await deleteCredentialController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should handle credential not found error and throw NotFoundError', async () => {
    const mockCredentialId = 'mockedCredentialId';
    deleteCredentialUseCaseMock.execute.mockRejectedValueOnce(new NotFoundError('Credential not found'));

    const mockRequest = {
      params: { id: mockCredentialId }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await deleteCredentialController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
