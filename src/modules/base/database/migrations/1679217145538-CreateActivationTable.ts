import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActivationTable1679217145538 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE activations (
                id serial PRIMARY KEY,
                user_id uuid REFERENCES users (id) ON DELETE CASCADE,
                email VARCHAR ( 100 ) NOT NULL,
                hash VARCHAR ( 100 ) NOT NULL
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE activations 
   DROP CONSTRAINT activations_user_id_fkey; 
   
            DROP TABLE IF EXISTS activations;
        `);
  }
}
