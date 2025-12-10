import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsersDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'ID must be a string' })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'updated@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provude a valid email address' })
  email?: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Jane',
  })
  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
  })
  @IsString({ message: 'Role must be a string' })
  @IsOptional()
  role?: string;

  @ApiProperty({
    description: 'User password',
    example: 'newStrongPassword@123',
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsOptional()
  password?: string;
}
