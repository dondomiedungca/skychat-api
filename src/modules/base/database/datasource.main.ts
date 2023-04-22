import { ConfigService } from '../config/config.service';
import { DataSourceOptions } from 'typeorm';
import { DatabaseType } from 'src/types/database.type';

export const initializeOptions = (
  env: string,
): DataSourceOptions & {
  seeds?: string[];
  factories?: string[];
} => {
  const configService = new ConfigService();
  const dataConfig: DatabaseType = configService.get('database', env);

  return {
    type: dataConfig.type as any,
    host: dataConfig.host,
    port: dataConfig.port,
    username: dataConfig.username,
    password: dataConfig.password,
    database: dataConfig.database,
    entities: ['dist/**/*.entity.{ts,js}'],
    migrations: ['dist/**/migrations/*.js'],
    migrationsTableName: 'migrations',
    synchronize: false,
  };
};
