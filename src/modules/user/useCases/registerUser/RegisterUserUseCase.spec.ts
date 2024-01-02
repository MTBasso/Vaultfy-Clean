import { IUserDTO } from '../../infra/entities/User';
import { IUserRepository } from '../../infra/repositories/IUserRepository';
import { RegisterUserUseCase } from './RegisterUserUseCase';

const RegisterUserUseCaseMock = RegisterUserUseCase as jest.Mock<RegisterUserUseCase>;

describe('Register User Use Case', () => {
  let sut: RegisterUserUseCase;

  const data: IUserDTO = {
    username: 'Jester',
    email: 'testeracc@jest.com',
    password: 'jestSuperSecretPassword'
  };

  const mockUserRepository: IUserRepository = {
    register: jest.fn().mockResolvedValueOnce({}),
    login: jest.fn().mockResolvedValueOnce({})
  };

  beforeEach(() => {
    sut = new RegisterUserUseCaseMock(mockUserRepository);
  });

  test('Should be able to register a new user', async () => {
    const response = await sut.execute(data);

    expect(response).toBe(undefined);
  });
});
