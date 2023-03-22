import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserRoleTable1679318092086 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE user_role (
                id serial PRIMARY KEY,
                user_id uuid REFERENCES users (id) ON DELETE CASCADE,
                role_id integer REFERENCES roles (id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_role 
   DROP CONSTRAINT user_role_user_id_fkey; 
   DROP CONSTRAINT user_role_role_id_fkey; 
   
            DROP TABLE IF EXISTS user_role;
        `);
  }
}
