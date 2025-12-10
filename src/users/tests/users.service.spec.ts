import { UsersService } from '../users.service';
import {
  mockDb,
  mockUserWithoutPassword,
} from '../test-helpers/users.test-setup';
import { CreateUsersDto } from '../dto/create-users.dto';
import { Test } from '@nestjs/testing';
import { DBService } from '../../db/db.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DBService, useValue: { db: mockDb } },
      ],
    }).compile();

    service = module.get(UsersService);
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    const createUserDto: CreateUsersDto = {
      email: '123@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123',
    };

    mockDb.limit.mockResolvedValue([]);
    mockDb.returning.mockResolvedValue([mockUserWithoutPassword]);

    const result = await service.create(createUserDto);
    expect(result).toEqual(mockUserWithoutPassword);
    expect(mockDb.insert).toHaveBeenCalled();
  });
});
