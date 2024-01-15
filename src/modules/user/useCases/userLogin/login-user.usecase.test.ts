import { container } from 'tsyringe';

import { IUserRepository } from '../../infra/repositories/user.repository.interface';
import { UserLoginUseCase } from './login-user.usecase';

const mockUserRepository: jest.Mocked<IUserRepository> = {
  register: jest.fn(),
  login: jest.fn(),
  listVaults: jest.fn()
};

container.register<IUserRepository>('UserRepository', { useValue: mockUserRepository });

describe('UserLoginUseCase', () => {
  let userLoginUseCase: UserLoginUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    userLoginUseCase = container.resolve(UserLoginUseCase);
  });

  it('should successfully log in a user and return a token', async () => {
    const mockLoginData = { email: 'test@example.com', password: 'testPassword' };

    mockUserRepository.login.mockResolvedValueOnce('mockedToken');

    const token = await userLoginUseCase.execute(mockLoginData);

    expect(token).toBe('mockedToken');
  });

  it('should throw an error for invalid login credentials', async () => {
    const mockLoginData = { email: 'invalid@example.com', password: 'invalidPassword' };

    mockUserRepository.login.mockRejectedValueOnce(new Error('Invalid login credentials'));

    await expect(userLoginUseCase.execute(mockLoginData)).rejects.toThrow('Invalid login credentials');
  });
});
