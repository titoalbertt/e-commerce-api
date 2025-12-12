import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import {
  mockUserWithoutPassword,
  createMockAuthService,
} from '../test-helpers/auth.test-setup';

describe('AuthController', () => {
  let controller: AuthController;

  // Mock implementation for AuthService
  const mockAuthService = createMockAuthService();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access token and user data on successful login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const authResponse: AuthResponseDto = {
        accessToken: 'jwt-token',
        user: mockUserWithoutPassword,
      };
      mockAuthService.login.mockResolvedValue(authResponse);
      const result = await controller.login(loginDto);

      expect(result).toEqual(authResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw error if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
