import { Test } from '@nestjs/testing';
import { RolesGuard } from '../guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { ROLES_KEY } from '../decorators/roles.decorators';
import {
  mockUserWithoutPassword,
  mockAdminUserWithoutPassword,
  createMockReflector,
  createMockExecutionContext,
} from '../test-helpers/auth.test-setup';
import { USER_ROLE } from '../../db/db.type';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  // Mock implementation for Reflector
  const mockReflector = createMockReflector();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should return true if no roles are required', () => {
      mockReflector.getAllAndOverride.mockReturnValue([]);
      const context = createMockExecutionContext(mockUserWithoutPassword);
      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return true if user has required role', () => {
      const requiredRoles = [USER_ROLE.ADMIN];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      const context = createMockExecutionContext(mockAdminUserWithoutPassword);
      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should throw ForbiddenException if user is not authenticated', () => {
      const requiredRoles = [USER_ROLE.USER];
      mockReflector.getAllAndOverride.mockReturnValue(requiredRoles);
      const context = createMockExecutionContext(undefined);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledTimes(1);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });
  });
});
