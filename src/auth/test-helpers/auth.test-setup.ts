import { User } from '../../db/schema';
import { USER_ROLE } from '../../db/db.type';

export const mockUser: User = {
  id: 'test-uuid',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'hashed-password',
  role: USER_ROLE.USER,
};

export const mockUserWithoutPassword = {
  id: 'test-uuid',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: USER_ROLE.USER,
};

export const mockAdminUser: User = {
  id: 'admin-uuid',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  password: 'hashed-password',
  role: USER_ROLE.ADMIN,
};

export const mockAdminUserWithoutPassword = {
  id: 'admin-uuid',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: USER_ROLE.ADMIN,
};

// Mock implementations for services
export const createMockUsersService = () => ({
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

export const createMockJwtService = () => ({
  validateUser: jest.fn(),
  login: jest.fn().mockResolvedValue({
    accessToken: 'mock-access',
    user: mockUserWithoutPassword,
  }),
});

export const createMockAuthService = () => ({
  validateUser: jest.fn(),
  login: jest.fn(),
});

export const createMockReflector = () => ({
  getAllAndOverride: jest.fn(),
  get: jest.fn(),
});

// Mock execution context for guards
export const createMockExecutionContext = (user?: unknown) => {
  const mockRequest = {
    user,
  };

  const mockContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  };

  return mockContext;
};
