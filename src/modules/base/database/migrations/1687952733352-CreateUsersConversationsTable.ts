import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersConversationsTable1687952733352
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE users_conversations (
                id serial PRIMARY KEY,
                display_name TEXT NOT NULL,
                conversation_id uuid REFERENCES conversations (id) ON DELETE CASCADE,
                user_id uuid REFERENCES users (id) ON DELETE CASCADE,
                related_to uuid REFERENCES users (id) ON DELETE CASCADE,
                deleted_at TIMESTAMP WITH TIME ZONE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE users_conversations DROP CONSTRAINT users_conversations_conversation_id_fkey; 
            ALTER TABLE users_conversations DROP CONSTRAINT users_conversations_user_id_fkey; 
            DROP TABLE IF EXISTS users_conversations;
        `);
  }
}
