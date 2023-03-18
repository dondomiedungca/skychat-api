import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceDevelopmentOptions } from './datasource.development';
import { dataSourceStagingOptions } from './datasource.staging';
import { dataSourceProductionOptions } from './datasource.production';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        switch (process.env.NODE_ENV || 'development') {
          case 'production':
            return dataSourceProductionOptions;
          case 'staging':
            return dataSourceStagingOptions;
          default:
            return dataSourceDevelopmentOptions;
        }
      },
    }),
  ],
})
class DatabaseModule {}

export default DatabaseModule;
