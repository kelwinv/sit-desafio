import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { testApp } from 'test/utils/testApp';
import {
  AuthErrorResponseDto,
  AuthResponseDto,
} from 'src/auth/dto/auth-response.dto';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';
import { PrismaService } from 'src/prisma/prisma.service';

describe('POST /auth/register', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await testApp();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it('should register a new user and return 201', async () => {
    const createUserDto: CreateUsersDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    const server = app.getHttpServer();

    const response = await request(server)
      .post('/auth/register')
      .send(createUserDto);

    expect(response.status).toBe(201);

    const { data: user } = response.body as AuthResponseDto & {
      data: { password?: string };
    };

    expect(user.id).toBeDefined();
    expect(user.email).toBe(createUserDto.email);
    expect(user.name).toBe(createUserDto.name);
    expect(user.password).toBeUndefined();
    expect(user.createdAt).toBeDefined();
  });

  it('should return 400 when email already exists', async () => {
    const createUserDto: CreateUsersDto = {
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'First User',
    };

    const server = app.getHttpServer();

    await request(server).post('/auth/register').send(createUserDto);

    const response = await request(server)
      .post('/auth/register')
      .send({
        ...createUserDto,
        name: 'Second User',
      });

    expect(response.status).toBe(400);
    expect((response.body as AuthErrorResponseDto).error).toContain(
      'Email already exists',
    );
  });

  it('should return 400 when required fields are missing', async () => {
    const incompleteUserDto = {
      email: 'incomplete@example.com',
    };

    const server = app.getHttpServer();
    const response = await request(server)
      .post('/auth/register')
      .send(incompleteUserDto);

    expect(response.status).toBe(400);
  });

  it('should return 400 when email format is invalid', async () => {
    const invalidUserDto = {
      email: 'invalid-email',
      password: 'password123',
      name: 'Test User',
    };

    const server = app.getHttpServer();
    const response = await request(server)
      .post('/auth/register')
      .send(invalidUserDto);

    expect(response.status).toBe(400);
  });

  it('should return 400 when password is too short', async () => {
    const weakPasswordDto = {
      email: 'weak@example.com',
      password: '123',
      name: 'Test User',
    };

    const server = app.getHttpServer();
    const response = await request(server)
      .post('/auth/register')
      .send(weakPasswordDto);

    const { message } = response.body as AuthErrorResponseDto;

    expect(response.status).toBe(400);
    expect(message).toContain('Password must be at least 6 characters');
  });
});
