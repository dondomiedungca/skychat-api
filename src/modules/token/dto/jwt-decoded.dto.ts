import { Role } from 'src/modules/user/entities/role.entity';

export class JWTDecodeDto {
  iat: number;
  'sub': string;
  'email': string;
  'roles': Role[];
  'exp': number;
}
