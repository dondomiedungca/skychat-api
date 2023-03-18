import { query } from 'express';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesTable1679124539620 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE roles (
                id serial PRIMARY KEY,
                name VARCHAR ( 100 ) UNIQUE NOT NULL
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS roles;
        `);
  }
}
