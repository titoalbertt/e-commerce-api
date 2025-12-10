import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  // Get all users
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      this.logger.error(
        'Error retrieving user by Id',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  // Get a single user by Id
  @Get(':id')
  @ApiOperation({ summary: 'Get user by Id' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string) {
    try {
      return this.usersService.findById(id);
    } catch (error) {
      this.logger.error(
        'Error retrieving user by Id',
        error instanceof Error ? error.stack : error,
      );
    }
  }

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

  // Update existing user
  @Patch(':id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'User does not exist' })
  async update(
    @Param('id') id: string,
    @Body() updateUsersDto: UpdateUsersDto,
  ) {
    try {
      return this.usersService.update(id, updateUsersDto);
    } catch (error) {
      this.logger.error(
        'Error updating user',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  // Delete a user
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    try {
      return this.usersService.remove(id);
    } catch (error) {
      this.logger.error(
        'Error deleting user',
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
