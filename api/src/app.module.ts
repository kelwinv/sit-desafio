import { Module } from '@nestjs/common';
import './config/dotenv';

import { HealthModule } from './health/health.module';

@Module({
  imports: [HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
