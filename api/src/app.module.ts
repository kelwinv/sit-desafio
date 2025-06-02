import { Module } from '@nestjs/common';
import './config/dotenv';

import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, HealthModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
