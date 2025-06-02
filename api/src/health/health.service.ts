import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type MysqlHealth = {
  status: string;
  version: string;
  max_connections: number;
  current_connections: number;
};

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getMysqlHealth(): Promise<MysqlHealth> {
    try {
      const targetDatabase = process.env.MYSQL_DATABASE || 'mysql';

      const data = await this.prisma.$queryRaw<
        [
          {
            max_connections: number;
            current_connections: number;
            database_name: string;
            version: string;
          },
        ]
      >`
        SELECT 
          CAST(@@max_connections AS UNSIGNED) AS max_connections,
          (SELECT COUNT(*) FROM information_schema.PROCESSLIST 
           WHERE DB = ${targetDatabase} AND COMMAND != 'Sleep') AS current_connections,
          ${targetDatabase} AS database_name,
          @@version AS version;
      `;

      const result = data[0];

      return {
        status: 'up',
        version: result.version,
        max_connections: Number(result.max_connections),
        current_connections: Number(result.current_connections),
      };
    } catch (_error: unknown) {
      return {
        status: 'down',
        version: 'unknown',
        max_connections: 0,
        current_connections: 0,
      };
    }
  }

  async getHealth() {
    const mysql = await this.getMysqlHealth();

    return {
      status: 'ok',
      updated_at: new Date().toISOString(),
      dependencies: {
        mysql,
      },
    };
  }
}
