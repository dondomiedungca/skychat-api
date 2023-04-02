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

export interface MailConfigType {
  port: number;
  host: string;
  secure: boolean;
  from: string;
  auth: {
    user: string;
    pass: string;
  };
}

export interface ConfigType {
  APP_URL: string;
  APP_TITLE: string;
  PORT: number;
  token: TokenType;
  database: DatabaseType;
  mail: MailConfigType;
}
