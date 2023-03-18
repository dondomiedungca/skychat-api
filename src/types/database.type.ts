export default interface DatabaseType {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: Array<any>;
  synchronize: boolean;
}
