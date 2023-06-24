import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserTable1681813139563 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE users
            ADD COLUMN user_meta json NULL,
            ALTER COLUMN password DROP NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE users
            DROP COLUMN user_meta;
        `);
  }
}
