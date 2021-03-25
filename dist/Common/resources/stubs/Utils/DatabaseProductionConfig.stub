import { ConnectionOptions } from "typeorm";
import { ConfigVariables } from "./ConfigVariables";

export const ProductionConfig = (): ConnectionOptions => ({
  type: "mysql",
  host: ConfigVariables().db_host,
  port: Number(ConfigVariables().db_port),
  username: ConfigVariables().db_username,
  password: ConfigVariables().db_password,
  database: ConfigVariables().db_database,
  synchronize: false,
  logging: false,
  migrations: ["./dist/Infrastructure/Persistence/TypeORM/Migrations/*.js"],
  migrationsTableName: "migrations",
  migrationsRun: true,
  entities: ["./dist/Domain/Entities/*.js", "./dist/Domain/Entities/**/*.js"],
  cli: {
    migrationsDir: "./TypeORM/Migrations",
  },
});

export default ProductionConfig();