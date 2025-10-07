import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USERNAME || 'hpbs_user',
  password: process.env.DATABASE_PASSWORD || 'hpbs_password',
  database: process.env.DATABASE_NAME || 'hpbs_pkh',
  entities: [join(__dirname, 'entities', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '**', '*{.ts,.js}')],
  synchronize: false, // NEVER use in production
  logging: process.env.DATABASE_LOGGING === 'true',
  charset: 'utf8mb4',
  timezone: 'Z',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;