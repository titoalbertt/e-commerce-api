import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import {
  mockUser,
  mockUserWithoutPassword,
  createMockUsersService,
  createMockJwtService,
} from '../test-helpers/auth.test-setup';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  // Mock implementations
  const mockUsersService = createMockUsersService();
  const mockJwtService = createMockJwtService();

  // Mock bcrypt.compare
  jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(email, password);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('should return null if user does not exist', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should return null if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });
  });

  describe('login', () => {
    it('should return access token and user data on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockToken = 'jwt-token';

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        accessToken: mockToken,
        user: mockUserWithoutPassword,
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
    });

    it('should throw error if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
    });
  });
});
