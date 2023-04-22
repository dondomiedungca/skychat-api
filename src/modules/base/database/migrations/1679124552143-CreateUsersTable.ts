import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1679124552143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE users (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                first_name VARCHAR ( 100 ) NOT NULL,
                last_name VARCHAR ( 100 ) NOT NULL,
                email VARCHAR ( 100 ) UNIQUE NOT NULL,
                password VARCHAR ( 120 ) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE,
                updated_at TIMESTAMP WITH TIME ZONE,
                verified_at TIMESTAMP WITH TIME ZONE NULL,
                is_deleted BOOLEAN DEFAULT FALSE,
                deleted_at TIMESTAMP WITH TIME ZONE NULL
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS users;
        `);
  }
}
