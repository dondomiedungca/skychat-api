import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@squareboat/nest-console';
import * as crypto from 'crypto';
import * as fs from 'fs';

import { DatabaseEnv } from './../types/database.type';

@Injectable()
export class CreateKeypair {
  constructor() {}

  @Command('create-keypair', {
    desc: 'Create the key pair that will use for hashing of data for this application.',
  })
  async promptUserInput(_cli: ConsoleIO) {
    let selectedEnv: DatabaseEnv;

    while (!selectedEnv) {
      selectedEnv = (await _cli.select(
        'Select environment for this key pair',
        [DatabaseEnv.DEVELOPMENT, DatabaseEnv.STAGING, DatabaseEnv.PRODUCTION],
        false,
      )) as DatabaseEnv;

      if (!selectedEnv) {
        _cli.error('Environment type is required.');
      }
    }

    _cli.success(
      `Key pairs successfuly created under the folder configurations/keys.`,
    );
    _cli.info(
      `Do not include the files to your repository. Keep them private.`,
    );

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });

    const publicDir =
      __dirname + `/../../configurations/keys/public.${selectedEnv}.key.pem`;
    const privateDir =
      __dirname + `/../../configurations/keys/private.${selectedEnv}.key.pem`;

    if (!fs.existsSync(__dirname + '/../../configurations/keys'))
      fs.mkdirSync(__dirname + '/../../configurations/keys', {
        recursive: true,
      });

    fs.writeFileSync(publicDir, publicKey);
    fs.writeFileSync(privateDir, privateKey);

    return;
  }
}
