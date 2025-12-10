import { ConflictException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { CreateUsersDto } from './dto/create-users.dto';
import { NewUser, User, users } from '../db/schema';
import { DBService } from '../db/db.service';
import { UpdateUsersDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(private dbService: DBService) {}

  // Create a new user
  async create(
    createUsersDto: CreateUsersDto,
  ): Promise<Omit<User, 'password'>> {
    //  Check if user is existed
    const existingUser = await this.findByEmail(createUsersDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already existed');
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(createUsersDto.password, 10);

    const newUser: NewUser = {
      ...createUsersDto,
      password: hashedPassword,
    };

    // Execute Insert
    const [user] = await this.dbService.db
      .insert(users)
      .values(newUser)
      .returning();

    return user;
  }

  // Update exisiting user
  async update(
    id: string,
    updateUsersDto: UpdateUsersDto,
  ): Promise<Omit<User, 'password'>> {
    const existingUser = await this.findById(updateUsersDto.id);
    if (!existingUser) {
      throw new ConflictException('User does not exist');
    }

    const updateData: Partial<NewUser> = { ...updateUsersDto };

    // hash password if it's being updated
    if (updateUsersDto.password) {
      updateData.password = await bcrypt.hash(updateUsersDto.password, 10);
    }

    // Execute update
    const [updatedUser] = await this.dbService.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  }

  // Delete user
  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new ConflictException('User does not exist');
    }

    await this.dbService.db.delete(users).where(eq(users.id, id));

    return { success: true, message: 'User deleted successfully' };
  }

  // Find all users
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return await this.dbService.db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
      })
      .from(users);
  }

  // Find use by email
  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ?? null;
  }

  // Find use by id
  async findById(id: string): Promise<User | null> {
    const [user] = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user ?? null;
  }
}
