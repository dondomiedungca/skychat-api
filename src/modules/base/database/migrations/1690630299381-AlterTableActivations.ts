import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableActivations1690630299381 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE activations ALTER COLUMN email DROP NOT NULL;
            ALTER TABLE activations ALTER COLUMN hash DROP NOT NULL;
            ALTER TABLE activations ALTER COLUMN user_id DROP NOT NULL;
            ALTER TABLE activations ADD COLUMN phone_number VARCHAR ( 100 ) NULL;
            ALTER TABLE activations ADD COLUMN code int NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE activations
            DROP COLUMN phone_number,
            DROP COLUMN code;
        `);
  }
}
