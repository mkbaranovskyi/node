import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass',
  database: 'postgres',
  synchronize: true, // TODO: set to false in production!
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/shared/database/migrations/*.js'],
});
