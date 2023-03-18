import { initializeOptions } from './datasource.main';
import { DatabaseEnv } from './../../types/database.type';
import { DataSource } from 'typeorm';

export const dataSourceDevelopmentOptions = initializeOptions(
  DatabaseEnv.DEVELOPMENT,
);

export default new DataSource(dataSourceDevelopmentOptions);
