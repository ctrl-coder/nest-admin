import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { SnakeNamingStrategy } from './src/snake-naming.strategy';

config();

export const ormConfig = {
  type: 'postgres',
  name: 'micro-shop',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  // subscribers: [UserSubscriber],
  // synchronize: true,
  entities: ['src/**/*.entity{.ts,.js}', 'src/**/*.view-entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
} as DataSourceOptions;

export default new DataSource(ormConfig);
