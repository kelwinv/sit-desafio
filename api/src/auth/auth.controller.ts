import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, AuthErrorResponseDto } from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with email, password and name',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors or email already exists',
    type: AuthErrorResponseDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const result = await this.authService.register(registerDto);
      return {
        message: 'User registered successfully',
        data: result.user,
        token: result.token,
      };
    } catch (error: unknown) {
      const timestamp = new Date().toISOString();

      if (error instanceof Error) {
        throw new BadRequestException({
          success: false,
          error: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp,
        });
      }

      throw new BadRequestException({
        success: false,
        error: 'Unexpected error during registration',
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp,
      });
    }
  }
}
