import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConversationsTable1687943070023
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TYPE IF EXISTS type;
            CREATE TYPE type AS ENUM ('personal', 'group');

            CREATE TABLE conversations (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                type type NOT NULL,
                conversation_meta jsonb NULL,
                created_at TIMESTAMP WITH TIME ZONE,
                updated_at TIMESTAMP WITH TIME ZONE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS conversations;
        `);
  }
}
