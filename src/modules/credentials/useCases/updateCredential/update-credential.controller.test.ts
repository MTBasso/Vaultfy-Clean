import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UnauthorizedError } from '../../../../shared/errors/Error';
import { UpdateCredentialController } from './update-credential.controller';
import { UpdateCredentialUseCase } from './update-credential.usecase';

jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn()
  }
}));

jest.mock('./update-credential.usecase', () => ({
  UpdateCredentialUseCase: jest.fn()
}));

describe('UpdateCredentialController', () => {
  let updateCredentialController: UpdateCredentialController;
  let updateCredentialUseCaseMock: jest.Mocked<UpdateCredentialUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    updateCredentialUseCaseMock = {
      execute: jest.fn()
    } as unknown as jest.Mocked<UpdateCredentialUseCase>;

    (container.resolve as jest.Mock).mockReturnValueOnce(updateCredentialUseCaseMock);
    updateCredentialController = new UpdateCredentialController();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should handle updating a credential successfully and return JSON response', async () => {
    const mockUserId = 'testUserId';
    const mockCredentialId = 'testCredentialId';
    const mockCredentialData = {
      service: 'testService',
      username: 'testUsername',
      password: 'testPassword'
    };

    const mockRequest = {
      params: { id: mockCredentialId },
      body: { ...mockCredentialData },
      user: { id: mockUserId, secret: 'testSecret' }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await updateCredentialController.handle(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ credential: undefined });
  });

  it('should handle unauthorized error and throw UnauthorizedError', async () => {
    const mockCredentialId = 'testCredentialId';

    const mockRequest = {
      params: { id: mockCredentialId },
      body: {},
      user: null // No user, triggering unauthorized error
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await updateCredentialController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedError);
    }

    expect(updateCredentialUseCaseMock.execute).not.toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
