import { Injectable } from '@nestjs/common';
import { DatabaseType } from 'src/types/database.type';

@Injectable()
export class ConfigService {
  private config: DatabaseType;

  constructor() {
    this.config = this.load();
  }

  private load(env?: string) {
    let config = require(`./../../../config/config.${
      env || process.env.NODE_ENV || 'development'
    }.json`);
    return config;
  }

  public get(property: string, env?: string) {
    if (!!env) {
      this.load(env);
    }
    return this.config[property];
  }
}
