import { BadRequestError, InternalServerError, NotFoundError } from '../../../../shared/errors/Error';
import * as prismaModule from '../../../../shared/infra/prisma/prismaClient';
import { VaultRepository } from './vault.repository';

jest.mock('../../../../shared/infra/prisma/prismaClient', () => ({
  prisma: {
    vault: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  }
}));

describe('VaultRepository', () => {
  const vaultRepository = new VaultRepository();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a vault', async () => {
      const mockCreatedVault = {
        id: 'mockedVaultId',
        userId: 'mockedUserId',
        name: 'Mocked Vault'
      };
      (prismaModule.prisma.vault.create as jest.Mock).mockResolvedValueOnce(mockCreatedVault);
      const mockVaultData = { userId: 'mockedUserId', name: 'Mocked Vault' };
      const result = await vaultRepository.register(mockVaultData);

      expect(prismaModule.prisma.vault.create).toHaveBeenCalledWith({ data: mockVaultData });
      expect(result).toEqual({
        id: mockCreatedVault.id,
        userId: mockCreatedVault.userId,
        name: mockCreatedVault.name
      });
    });

    it('should throw InternalServerError when Prisma create fails', async () => {
      (prismaModule.prisma.vault.create as jest.Mock).mockRejectedValueOnce(new Error('Unexpected Prisma error'));

      const mockVaultDTO = { userId: 'mockedUserId', name: 'Mocked Vault' };

      await expect(vaultRepository.register(mockVaultDTO)).rejects.toThrow(InternalServerError);
    });
  });

  describe('findByIdAndListCredentials', () => {
    it('should find a vault by its id and list credentials', async () => {
      const mockedCredentials = [
        { id: 'credId1', service: 'Service1', username: 'User1' },
        { id: 'credId2', service: 'Service2', username: 'User2' }
      ];
      const mockCreatedVault = {
        id: 'mockedVaultId',
        userId: 'mockedUserId',
        name: 'Mocked Vault',
        credential: mockedCredentials
      };

      (prismaModule.prisma.vault.findMany as jest.Mock).mockResolvedValueOnce([mockCreatedVault]);

      const result = await vaultRepository.findByIdAndListCredentials(mockCreatedVault.id);

      expect(prismaModule.prisma.vault.findMany).toHaveBeenCalledWith({
        where: { id: mockCreatedVault.id },
        include: {
          credential: {
            where: { vaultId: mockCreatedVault.id },
            select: { id: true, service: true, username: true }
          }
        }
      });

      expect(result).toEqual({
        id: mockCreatedVault.id,
        userId: mockCreatedVault.userId,
        name: mockCreatedVault.name,
        credential: mockedCredentials
      });
    });

    it('should throw BadRequestError when missing id in request', async () => {
      await expect(vaultRepository.findByIdAndListCredentials('')).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError when vault not found', async () => {
      (prismaModule.prisma.vault.findMany as jest.Mock).mockResolvedValueOnce(null);

      try {
        await vaultRepository.findByIdAndListCredentials('nonExistingId');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should find vault by id and update', async () => {
      const mockedVault = {
        id: 'mockedVaultId',
        userId: 'mockedUserId',
        name: 'Updated Vault'
      };

      (prismaModule.prisma.vault.update as jest.Mock).mockResolvedValueOnce(mockedVault);

      const result = await vaultRepository.findByIdAndUpdate(mockedVault.id, 'Updated Vault');

      expect(prismaModule.prisma.vault.update).toHaveBeenCalledWith({
        where: { id: mockedVault.id },
        data: { name: 'Updated Vault' }
      });

      expect(result).toEqual({
        id: mockedVault.id,
        userId: mockedVault.userId,
        name: 'Updated Vault'
      });
    });

    it('should throw BadRequestError when missing fields in request', async () => {
      await expect(vaultRepository.findByIdAndUpdate('', 'Updated Vault')).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError when vault not found', async () => {
      (prismaModule.prisma.vault.update as jest.Mock).mockResolvedValueOnce(null);

      try {
        await vaultRepository.findByIdAndUpdate('1', 'Updated Vault');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });
  });

  describe('findByIdAndDelete', () => {
    it('should find vault by id and delete', async () => {
      const mockedVaultId = 'mockedVaultId';

      (prismaModule.prisma.vault.delete as jest.Mock).mockResolvedValueOnce({ id: mockedVaultId });

      await vaultRepository.findByIdAndDelete(mockedVaultId);

      expect(prismaModule.prisma.vault.delete).toHaveBeenCalledWith({ where: { id: mockedVaultId } });
    });

    it('should throw BadRequestError when missing id in request', async () => {
      await expect(vaultRepository.findByIdAndDelete('')).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError when vault not found', async () => {
      (prismaModule.prisma.vault.delete as jest.Mock).mockResolvedValueOnce(null);

      try {
        await vaultRepository.findByIdAndDelete('nonExistentId');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
      }
    });
  });
});
