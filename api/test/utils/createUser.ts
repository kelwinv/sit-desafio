import { TestUser, TestUserWithToken } from 'test/types/types';
import { generateTestToken } from './generateToken';
import { PrismaService } from 'src/prisma/prisma.service';

async function createTestUser(
  userData: {
    email: string;
    name: string;
  },
  prismaService: PrismaService,
): Promise<TestUser> {
  const user = await prismaService.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: 'hashed_password_mock',
    },
  });

  return {
    id: user.id,
    email: userData.email,
    name: userData.name,
  };
}

async function createTestUserWithToken(
  userData: {
    email: string;
    name: string;
  },
  prismaService: PrismaService,
): Promise<TestUserWithToken> {
  const user = await prismaService.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: 'hashed_password_mock',
    },
  });

  const token = generateTestToken(user.id, user.email);

  return {
    ...user,
    token,
  };
}

export { createTestUser, createTestUserWithToken };
