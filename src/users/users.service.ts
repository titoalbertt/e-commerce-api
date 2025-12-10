import { ConflictException, Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { NewUser, User, users } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { CreateUsersDto } from './dto/create-users.dto';

@Injectable()
export class UsersService {
  constructor(private dbService: DBService) {}

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

    // Create new user
    const newUser: NewUser = {
      ...createUsersDto,
      password: hashedPassword,
    };

    const [user] = await this.dbService.db
      .insert(users)
      .values(newUser)
      .returning();

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.dbService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ?? null;
  }
}
