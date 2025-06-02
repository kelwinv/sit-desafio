import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { testApp } from 'test/utils/testApp';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from 'src/auth/dto/login.dto';
import { hashPassword } from 'test/utils/hashPassword';
import {
  AuthErrorResponseDto,
  AuthResponseDto,
} from 'src/auth/dto/auth-response.dto';

const userMock = {
  email: 'login@example.com',
  password: hashPassword('password123'),
  name: 'Login User',
};

describe('POST /auth/login', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await testApp();
    prisma = app.get<PrismaService>(PrismaService);

    await prisma.user.create({
      data: userMock,
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  it('should login user and return access token', async () => {
    const loginDto: LoginDto = {
      email: 'login@example.com',
      password: 'password123',
    };

    const server = app.getHttpServer();
    const response = await request(server).post('/auth/login').send(loginDto);

    expect(response.status).toBe(200);

    const { data: authData, token } = response.body as AuthResponseDto;

    expect(token).toBeDefined();
    expect(authData.id).toBeDefined();
    expect(authData.email).toBe(loginDto.email);
    expect(authData.name).toBe(userMock.name);
    expect((authData as { password?: string }).password).toBeUndefined();

    const decoded = jwt.decode(token) as { email: string; sub: string };

    expect(decoded.email).toBe(loginDto.email);
    expect(decoded.sub).toBe(authData.id);
  });

  it('should return 401 when credentials are invalid', async () => {
    const invalidLoginDto: LoginDto = {
      email: 'login@example.com',
      password: 'wrongpassword',
    };

    const server = app.getHttpServer();
    const response = await request(server)
      .post('/auth/login')
      .send(invalidLoginDto);

    const body = response.body as AuthErrorResponseDto;

    expect(response.status).toBe(401);
    expect(body.message).toContain('Invalid credentials');
  });

  it('should return 401 when user does not exist', async () => {
    const nonExistentLoginDto: LoginDto = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    const server = app.getHttpServer();
    const response = await request(server)
      .post('/auth/login')
      .send(nonExistentLoginDto);

    const body = response.body as AuthErrorResponseDto;

    expect(response.status).toBe(401);
    expect(body.message).toContain('Invalid credentials');
  });

  it('should return 400 when required fields are missing', async () => {
    const incompleteLoginDto = {
      email: 'login@example.com',
    };

    const server = app.getHttpServer();
    const response = await request(server)
      .post('/auth/login')
      .send(incompleteLoginDto);

    expect(response.status).toBe(400);
  });
});
