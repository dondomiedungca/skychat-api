import { Injectable } from '@nestjs/common';
import { ConfigType } from 'src/types/config.type';

@Injectable()
export class ConfigService {
  private config: ConfigType;

  constructor() {
    this.config = this.load();
  }

  private load(env?: string): ConfigType {
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
