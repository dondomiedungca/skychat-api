import { initializeOptions } from './datasource.main';
import { DatabaseEnv } from './../../../types/database.type';
import { DataSource } from 'typeorm';

export const dataSourceStagingOptions = initializeOptions(DatabaseEnv.STAGING);

export default new DataSource(dataSourceStagingOptions);
