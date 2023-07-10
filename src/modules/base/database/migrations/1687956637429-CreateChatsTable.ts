import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatsTable1687956637429 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE chats (
                id serial PRIMARY KEY,
                user_id uuid REFERENCES users (id) ON DELETE CASCADE,
                conversation_id uuid REFERENCES conversations (id) ON DELETE CASCADE,
                text TEXT NULL,
                chat_meta jsonb NULL,
                readed_at TIMESTAMP WITH TIME ZONE,
                deleted_at TIMESTAMP WITH TIME ZONE,
                deleted_by uuid REFERENCES users (id) ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE chats DROP CONSTRAINT chats_user_id_fkey; 
            ALTER TABLE chats DROP CONSTRAINT chats_conversation_id_fkey; 
            ALTER TABLE chats DROP CONSTRAINT chats_deleted_by_fkey; 
            DROP TABLE IF EXISTS chats;
        `);
  }
}
