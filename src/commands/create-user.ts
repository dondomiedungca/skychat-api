import { UserService } from 'src/modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { Command, ConsoleIO } from '@squareboat/nest-console';
import { UserRepository } from 'src/modules/user/user.repository';

import { RolesType } from './../types/roles.type';

@Injectable()
export class CreateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  @Command('create-user {name=world}', {
    desc: 'Create a normal user (NOTE: You should create first the Admin user nad only once).',
  })
  async promptUserInput(_cli: ConsoleIO) {
    _cli.info(`Good day! Let's create your first user`);
    _cli.info(
      `(NOTE: You should create first the Admin user nad only once).\n`,
    );

    let firstName: string;
    let lastName: string;
    let email: string;
    let password: string;
    let confirm_password: string;

    while (!firstName) {
      firstName = await _cli.ask('What is the First name?');
      if (!firstName) {
        _cli.error('First name is required.');
      }
    }

    while (!lastName) {
      lastName = await _cli.ask('What is the Last name?');
      if (!lastName) {
        _cli.error('Last name is required.');
      }
    }

    while (!email) {
      email = await _cli.ask('What is the E-mail?');
      if (!email) {
        _cli.error('E-mail name is required.');
      }
      if (!!email) {
        const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
        if (!regex.test(email)) {
          email = null;
          _cli.error('Please put a valid e-mail.');
        }
      }
      if (!!email) {
        const checkByEmail = await this.userRepository.findByEmail(email);
        if (!!checkByEmail) {
          email = null;
          _cli.error('Email is already exist.');
        }
      }
    }

    _cli.info(
      `\nAt least six alphanumeric including uppercase, lowercase and special characters\n`,
    );

    while (!password) {
      password = await _cli.password('Enter the password');
      if (!password) {
        _cli.error('Password is required.');
      }
      if (!!password) {
        const passwordRegex =
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if (!passwordRegex.test(password)) {
          password = null;
          _cli.error('Please follow the password rules.');
        }
      }
    }

    while (!confirm_password) {
      confirm_password = await _cli.password('Re-enter the password');
      if (!confirm_password) {
        _cli.error('Re-entering password is required.');
      }
      if (confirm_password !== password) {
        confirm_password = null;
        _cli.error(
          'Re-entered password is not the same with your previous password.',
        );
      }
    }

    await this.userService.createUserFromCommand(
      {
        firstName,
        lastName,
        email,
        password,
      },
      RolesType.NORMAL_USER,
    );

    _cli.success(
      'User successfuly created. We sent you an email verification. Activate now and you are ready to login!! 😀',
    );

    return;
  }
}
