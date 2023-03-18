import { Injectable } from '@nestjs/common';
import DatabaseType from 'src/types/database.type';

@Injectable()
export class ConfigService {
  private config: DatabaseType;

  constructor() {
    this.config = this.load();
  }

  private load() {
    let config = require(`./../../../config/config.development.json`);
    return config;
  }

  public get(property: string) {
    return this.config[property];
  }
}
