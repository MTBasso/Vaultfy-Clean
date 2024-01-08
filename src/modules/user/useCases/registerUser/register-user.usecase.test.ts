import { container } from 'tsyringe';

import { ConflictError, InternalServerError } from '../../../../shared/errors/Error';
import { IUserDTO } from '../../infra/entities/user.entity';
import { IUserRepository } from '../../infra/repositories/user.repository.interface';
import { RegisterUserUseCase } from './register-user.usecase';

const mockUserRepository: jest.Mocked<IUserRepository> = {
  register: jest.fn(),
  login: jest.fn()
};

container.register<IUserRepository>('UserRepository', { useValue: mockUserRepository });

describe('register-user.usecase', () => {
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    registerUserUseCase = container.resolve(RegisterUserUseCase);
  });

  it('should register a user successfully', async () => {
    const userData: IUserDTO = { username: 'testUser', email: 'test@example.com', password: 'testPassword' };
    mockUserRepository.register.mockResolvedValueOnce(userData);

    const result = await registerUserUseCase.execute(userData);

    expect(mockUserRepository.register).toHaveBeenCalledWith(userData);
    expect(result).toEqual(userData);
  });

  it('should throw ConflictError for duplicate email registration', async () => {
    // Mocking repository behavior to simulate a conflict (user with duplicate email)
    const userData: IUserDTO = { username: 'existingUser', email: 'existing@example.com', password: 'testPassword' };
    mockUserRepository.register.mockRejectedValueOnce(new ConflictError('User with this email already exists'));

    try {
      await registerUserUseCase.execute(userData);
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictError);
    }

    expect(mockUserRepository.register).toHaveBeenCalledWith(userData);
  });

  it('should throw InternalServerError for general registration error', async () => {
    // Mocking repository behavior to simulate a general registration error
    const userData: IUserDTO = { username: 'testUser', email: 'test@example.com', password: 'testPassword' };
    mockUserRepository.register.mockRejectedValueOnce(new InternalServerError('Error while creating the user'));

    try {
      await registerUserUseCase.execute(userData);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
    }

    expect(mockUserRepository.register).toHaveBeenCalledWith(userData);
  });
});
