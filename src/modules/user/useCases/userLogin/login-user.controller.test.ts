import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { InternalServerError } from '../../../../shared/errors/Error';
import { IUserDTO } from '../../infra/entities/user.entity';
import { UserLoginController } from './login-user.controller';
import { UserLoginUseCase } from './login-user.usecase';

jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn()
  }
}));

jest.mock('./login-user.usecase', () => ({
  UserLoginUseCase: jest.fn()
}));

describe('UserLoginController', () => {
  let userLoginController: UserLoginController;
  let userLoginUseCaseMock: jest.Mocked<UserLoginUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();
    userLoginUseCaseMock = {
      execute: jest.fn()
    } as unknown as jest.Mocked<UserLoginUseCase>;

    (container.resolve as jest.Mock).mockReturnValueOnce(userLoginUseCaseMock);
    userLoginController = new UserLoginController();
  });

  it('should handle user login and return a token', async () => {
    const userLoginUseCaseMock = container.resolve(UserLoginUseCase);
    jest.spyOn(container, 'resolve').mockReturnValueOnce(userLoginUseCaseMock);
    (userLoginUseCaseMock.execute as jest.Mock).mockResolvedValueOnce('mockedToken');

    const mockRequest = {
      body: { email: 'test@example.com', password: 'testPassword' }
    } as unknown as jest.Mocked<Request>;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    } as unknown as jest.Mocked<Response>;

    (userLoginUseCaseMock.execute as jest.Mock).mockResolvedValueOnce(mockRequest.body);

    await userLoginController.handle(mockRequest, mockResponse);

    // Expectations
    expect(mockResponse.cookie).toHaveBeenCalledWith('token', 'mockedToken');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Logged In',
      token: 'mockedToken'
    });
  });

  it('should handle login error and throw InternalServerError', async () => {
    const mockUserData: IUserDTO = { email: 'test@example.com', password: 'testPassword' };
    const userLoginUseCaseMock = container.resolve(UserLoginUseCase) as jest.Mocked<UserLoginUseCase>;
    userLoginUseCaseMock.execute.mockRejectedValueOnce(new InternalServerError('Some error'));

    const mockRequest = {
      body: mockUserData
    } as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as jest.Mocked<Response>;

    try {
      await userLoginController.handle(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
    }

    expect(mockResponse.status).not.toHaveBeenCalledWith(200);
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
