import { User } from 'src/db/schema';

export const mockUser: User = {
  id: 'test-uuid',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'hashed-password',
};

export const mockUserWithoutPassword: Omit<User, 'password'> = {
  id: 'test-uuid',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
};

export const mockUpdatedUser: Omit<User, 'password'> = {
  id: 'test-uuid',
  email: 'updated@example.com',
  firstName: 'Updated',
  lastName: 'User',
};

export const mockDb = {
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockResolvedValue([mockUserWithoutPassword]),
  limit: jest.fn().mockResolvedValue([]),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
};
