import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  // Create a new user
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 200, description: 'User created successfully' })
  @ApiResponse({
    status: 409,
    description: 'User with this email already existed',
  })
  async create(@Body() createUsersDto: CreateUsersDto) {
    try {
      return this.usersService.create(createUsersDto);
    } catch (error) {
      this.logger.error(
        'Error creating user',
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
