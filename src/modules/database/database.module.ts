import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './datasource';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
})
class DatabaseModule {}

export default DatabaseModule;
