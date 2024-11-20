import { MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as moment from 'moment-timezone';

export class CreateTestUsers1682080140966 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let users: Promise<any>[] = [];

    for (let i = 0; i < 100; i++) {
      const first_name = faker.name.firstName().replace(/'/g, '"');
      const last_name = faker.name.lastName().replace(/'/g, '"');
      const email = faker.internet.email(first_name, last_name, 'test.dev', {
        allowSpecialCharacters: false,
      });
      const picture = 'https://i.pravatar.cc/100';
      const user_meta = {
        profile_photo: picture,
        activity: {
          show_activity: true,
          last_active: new Date(),
          is_active: false,
        },
      };
      const created_at = moment.utc().format();
      const updated_at = moment.utc().format();
      const verified_at = moment.utc().format();
      const is_deleted = false;

      users.push(
        await queryRunner.query(`
            DO $$
            DECLARE userId uuid;
            BEGIN
              INSERT INTO users(first_name, last_name, email, user_meta, created_at, updated_at, verified_at, is_deleted)
              VALUES ('${first_name}', '${last_name}', '${email}', '${JSON.stringify(
          user_meta,
        )}', '${created_at}', '${updated_at}', '${verified_at}', ${is_deleted}) RETURNING id INTO userId;

              INSERT INTO user_role (user_id, role_id) VALUES (userId, 2);
            END $$;
        `),
      );
    }

    await Promise.all(users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM users WHERE email LIKE '%test.dev%';
        `);
  }
}
