import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokensTable1679124617045 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE tokens (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id uuid REFERENCES users (id) ON DELETE CASCADE,
                token_hash VARCHAR ( 100 ) NOT NULL
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE tokens 
   DROP CONSTRAINT tokens_user_id_fkey; 
   
            DROP TABLE IF EXISTS tokens;
        `);
  }
}
