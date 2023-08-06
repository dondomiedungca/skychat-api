import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserNotificationDto1691244328714
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE user_notification_tokens (
                id serial PRIMARY KEY,
                user_id uuid REFERENCES users (id) ON DELETE CASCADE,
                token VARCHAR ( 250 ) NOT NULL,
                device_unique_id VARCHAR ( 250 ) NOT NULL,
                deleted_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_notification_tokens DROP CONSTRAINT user_notification_tokens_user_id_fkey;
            DROP TABLE IF EXISTS user_notification_tokens;
        `);
  }
}
