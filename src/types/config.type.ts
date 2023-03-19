import { DatabaseType } from './database.type';

export interface TokenType {
  saltRound: number;
  exp: {
    days: number;
    hours: number;
  };
}

export interface ConfigType {
  PORT: number;
  token: TokenType;
  database: DatabaseType;
}
