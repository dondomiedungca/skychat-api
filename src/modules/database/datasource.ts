import DatabaseType from 'src/types/database.type';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from './../config/config.service';

const configService = new ConfigService();
const dataConfig: DatabaseType = configService.get('database');

export const dataSourceOptions: DataSourceOptions = {
  type: dataConfig.type as any,
  host: dataConfig.host,
  port: dataConfig.port,
  username: dataConfig.username,
  password: dataConfig.password,
  database: dataConfig.database,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/modules/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
