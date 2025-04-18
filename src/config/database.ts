import { Injectable } from '@nestjs/common';
import { secondToMilliseconds } from '../utils/time';
import { displayAppName, hasShowDebugInfoDB } from '.';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConnectionManager, getConnectionManager } from 'typeorm';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

export const DEFAULT_CONNECTION_NAME = 'default';

export function hasSynchronizeDatabase() {
  return ['1', 'true'].includes(process.env.SYNC_DB);
}

export function getPostgresOption(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    logging: hasShowDebugInfoDB(),
    host: process.env.DB_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),
    maxQueryExecutionTime: secondToMilliseconds(2),
    entities: [__dirname + '/../entities/**{.ts,.js}'],
    synchronize: hasSynchronizeDatabase(),
    namingStrategy: new SnakeNamingStrategy(),
    subscribers: [],
    extra: {
      application_name: displayAppName(),
      statement_timeout: secondToMilliseconds(30),
      // Add the following line to set maximum connection TTL
      idleTimeout: secondToMilliseconds(60), // Set idle timeout to 60 seconds
      max: 100,
    },
  };
}

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const connectionManager: ConnectionManager = getConnectionManager();
    let options: any;
    if (connectionManager.has(DEFAULT_CONNECTION_NAME)) {
      const connection = connectionManager.get(DEFAULT_CONNECTION_NAME);
      options = connection.options;
      await connection.close();
    } else {
      options = getPostgresOption();
    }
    return options;
  }
}
