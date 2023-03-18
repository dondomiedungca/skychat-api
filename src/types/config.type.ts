import { DatabaseType } from './database.type';

export interface TokenType {
  saltRound: number;
  publicKey: string;
  privateKey: string;
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
