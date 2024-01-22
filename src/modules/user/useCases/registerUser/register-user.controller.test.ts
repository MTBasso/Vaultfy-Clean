import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { InternalServerError } from '../../../../shared/errors/Error';
import { IUserDTO } from '../../infra/entities/user.entity';
import { RegisterUserController } from './register-user.controller';
import { RegisterUserUseCase } from './register-user.usecase';

jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn()
  }
}));

jest.mock('./register-user.usecase', () => ({
  RegisterUserUseCase: jest.fn()
}));

describe('register-user.controller', () => {
  let registerUserController: RegisterUserController;
  let registerUserUseCaseMock: jest.Mocked<RegisterUserUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    registerUserUseCaseMock = {
      execute: jest.fn()
    } as unknown as jest.Mocked<RegisterUserUseCase>;

    (container.resolve as jest.Mock).mockReturnValueOnce(registerUserUseCaseMock);
    registerUserController = new RegisterUserController();
  });

  it('should handle registration successfully and return JSON response', async () => {
    const mockUserData: IUserDTO = { username: 'testUser', email: 'test@example.com', password: 'testPassword' };
    const registerUserUseCaseMock = container.resolve(RegisterUserUseCase) as jest.Mocked<RegisterUserUseCase>;
    jest.spyOn(container, 'resolve').mockReturnValueOnce(registerUserUseCaseMock);
    registerUserUseCaseMock.execute.mockResolvedValueOnce(mockUserData);

    const mockRequest = {
      body: mockUserData
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    await registerUserController.handle(mockRequest, mockResponse);

    // Ensure that the response status is set to 201
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    // Ensure that the response JSON method is called with the correct data
    expect(mockResponse.json).toHaveBeenCalledWith({
      user: mockUserData
    });
  });

  it('should handle registration error and throw InternalServerError', async () => {
    const mockUserData: IUserDTO = { username: 'testUser', email: 'test@example.com', password: 'testPassword' };
    const registerUserUseCaseMock = container.resolve(RegisterUserUseCase) as jest.Mocked<RegisterUserUseCase>;
    registerUserUseCaseMock.execute.mockRejectedValueOnce(new InternalServerError('Some error'));

    const mockRequest = {
      body: mockUserData
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    // Use try-catch to handle the expected InternalServerError
    try {
      await registerUserController.handle(mockRequest, mockResponse);
      // If the registration is successful, this code won't be reached
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
    }

    // Ensure that the response status is not set to 201 in case of an error
    expect(mockResponse.status).not.toHaveBeenCalledWith(201);
    // Ensure that the response JSON method is not called in case of an error
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
