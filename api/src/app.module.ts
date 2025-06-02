import { Module } from '@nestjs/common';
import './config/dotenv';

import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [PrismaModule, HealthModule, UsersModule, AuthModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
