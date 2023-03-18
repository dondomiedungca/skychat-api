import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser1679119716968 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE users (
                user_id serial PRIMARY KEY,
                username VARCHAR ( 50 ) UNIQUE NOT NULL,
                password VARCHAR ( 50 ) NOT NULL,
                email VARCHAR ( 255 ) UNIQUE NOT NULL,
                created_on TIMESTAMP NOT NULL,
                last_login TIMESTAMP
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
