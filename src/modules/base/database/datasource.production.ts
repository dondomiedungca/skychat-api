import { initializeOptions } from './datasource.main';
import { DatabaseEnv } from './../../../types/database.type';
import { DataSource } from 'typeorm';

export const dataSourceProductionOptions = initializeOptions(
  DatabaseEnv.PRODUCTION,
);

export default new DataSource(dataSourceProductionOptions);
