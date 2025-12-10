import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUsersDto {
  @ApiProperty({
    description: 'Id of the user to be deleted',
    example: 'test-uuid-123',
  })
  @IsString({ message: 'Id must be a string' })
  @IsNotEmpty({ message: 'id is required' })
  id: string;
}
