import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User unique identifier' })
  id: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User full name' })
  name: string;

  @ApiProperty({ description: 'User creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'User last update timestamp' })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Response message' })
  message: string[];

  @ApiProperty({ description: 'User data', type: UserResponseDto })
  data: UserResponseDto;

  @ApiProperty({ description: 'JWT access token' })
  token: string;
}

export class AuthErrorResponseDto {
  @ApiProperty({ description: 'Error message' })
  error: string;

  @ApiProperty({ description: 'messages about error' })
  message: string[];

  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;
}
