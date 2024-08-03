import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import { SnakeNamingStrategy } from '@/snake-naming.strategy';

@Injectable()
export class ServerConfigService {
  constructor(private configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }
  get env(): {
    isStaging: boolean;
    isDev: boolean;
    isProd: boolean;
  } {
    return {
      isStaging: this.nodeEnv === 'staging',
      isDev: this.nodeEnv === 'development',
      isProd: this.nodeEnv === 'production',
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get postgresConfig(): TypeOrmModuleOptions {
    const entities = [
      __dirname + '/../modules/**/*.entity{.ts,.js}',
      __dirname + '/../modules/**/*.view-entity{.ts,.js}',
    ];
    const migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

    return {
      entities,
      migrations,
      keepConnectionAlive: this.env.isStaging || this.env.isProd,
      dropSchema: this.env.isDev,
      type: 'postgres',
      name: 'micro-shop',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
    };
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);
    return value.replaceAll('\\n', '\n');
  }
  private getNumber(key: string): number {
    const value = this.get(key);
    try {
      if (Number.isNaN(Number(value))) {
        throw new Error();
      }

      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private get(key: string) {
    const value = this.configService.get<string>(key);
    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }
    return value;
  }
}
