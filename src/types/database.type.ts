export interface DatabaseType {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: Array<any>;
  synchronize: boolean;
}

export enum DatabaseEnv {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}
