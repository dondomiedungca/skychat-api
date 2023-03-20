import { DatabaseEnv } from './../../types/database.type';
import { Injectable } from '@nestjs/common';

import dataSourceDevelopment from './datasource.development';
import dataSourceStaging from './datasource.staging';
import dataSourceproduction from './datasource.production';

@Injectable()
export class DatabaseService {
  getDataSource(environment: DatabaseEnv) {
    switch (environment) {
      case DatabaseEnv.PRODUCTION:
        return dataSourceDevelopment;
      case DatabaseEnv.STAGING:
        return dataSourceStaging;
      default:
        return dataSourceproduction;
    }
  }
}
