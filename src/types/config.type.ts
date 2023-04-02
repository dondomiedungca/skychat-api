import { DatabaseType } from './database.type';

export interface TokenType {
  saltRound: number;
  exp: {
    access: {
      months: number;
      days: number;
      hours: number;
      minutes: number;
    };
    refresh: {
      months: number;
      days: number;
      hours: number;
      minutes: number;
    };
  };
}

export interface ConfigType {
  PORT: number;
  token: TokenType;
  database: DatabaseType;
}
