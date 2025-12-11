import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { USER_ROLE } from 'src/db/db.type';

// Define a user interface with the role property
interface RequestUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Define an extended request interface
interface AuthenticatedRequest {
  user: RequestUser;
}

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Guards
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  // Get all users
  @Get()
  @Roles(USER_ROLE.ADMIN)
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
  @Roles(USER_ROLE.ADMIN)
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
  @Roles(USER_ROLE.ADMIN)
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

  // Get current user profile
  @Get('profile/me')
  @Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Req() request: AuthenticatedRequest) {
    try {
      const user = request.user;
      return await this.usersService.findByIdWithoutPassword(user.id);
    } catch (error) {
      this.logger.error(
        'Error retrieving user profile',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  // Update existing user
  @Patch(':id')
  @Roles(USER_ROLE.ADMIN)
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
  @Roles(USER_ROLE.ADMIN)
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
