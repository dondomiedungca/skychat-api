import { Injectable } from '@nestjs/common';
import { ConfigType } from 'src/types/config.type';
import configSchema from './schema';

@Injectable()
export class ConfigService {
  private config: ConfigType;

  constructor() {
    this.config = this.load();
  }

  private load(env?: string): ConfigType {
    let config = require(`${process.cwd()}/configurations/config.${
      env || process.env.NODE_ENV || 'development'
    }.json`);

    (async () => {
      await configSchema.validateAsync(config).catch((e) => {
        throw new Error(e);
      });
    })();

    return config;
  }

  public get(property: string, env?: string) {
    if (!!env) {
      this.load(env);
    }
    return this.config[property];
  }
}
