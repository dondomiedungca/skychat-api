import { DatabaseEnv } from './../../types/database.type';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceDevelopmentOptions } from './datasource.development';
import { dataSourceStagingOptions } from './datasource.staging';
import { dataSourceProductionOptions } from './datasource.production';
import { DatabaseService } from './database.service';
import { ConfigService } from '../config/config.service';

const connectionProvider = {
  provide: 'CONNECTION',
  useFactory: async (configService: ConfigService) => {
    const environment = await configService.get('environment');
    const dataSourceManager = await new DatabaseService()
      .getDataSource(environment)
      .initialize();

    return dataSourceManager;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        switch (process.env.NODE_ENV || 'development') {
          case DatabaseEnv.PRODUCTION:
            return dataSourceProductionOptions;
          case DatabaseEnv.STAGING:
            return dataSourceStagingOptions;
          default:
            return dataSourceDevelopmentOptions;
        }
      },
    }),
  ],
  exports: ['CONNECTION'],
  providers: [connectionProvider],
})
class DatabaseModule {}

export default DatabaseModule;
