import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, AuthErrorResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';

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
        message: ['User registered successfully'],
        data: result.user,
        token: result.token,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException({
          error: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
          message: [error.message],
        } as AuthErrorResponseDto);
      }

      throw new BadRequestException({
        error: 'Unexpected error during registration',
        statusCode: HttpStatus.BAD_REQUEST,
        message: [],
      } as AuthErrorResponseDto);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates user with email and password',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: AuthErrorResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const result = await this.authService.login(loginDto);
      return {
        message: ['Login successful'],
        data: result.user,
        token: result.token,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException({
          error: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
          message: [error.message],
        } as AuthErrorResponseDto);
      }

      throw new BadRequestException({
        error: 'Unexpected error during registration',
        statusCode: HttpStatus.BAD_REQUEST,
        message: [],
      } as AuthErrorResponseDto);
    }
  }
}
