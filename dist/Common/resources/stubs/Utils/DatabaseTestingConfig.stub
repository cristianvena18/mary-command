import { ConnectionOptions } from "typeorm";

export const TestingConfig = (): ConnectionOptions => ({
  type: "sqlite",
  database: ":memory:",
  dropSchema: true,
  synchronize: false,
  migrationsRun: true,
  migrations: ["./TypeORM/MigrationsTests/*.ts"],
  migrationsTableName: "migrations",
  logging: false,
  entities: ["./src/Domain/Entities/*.ts", "./dist/Domain/Entities/**/*.js"],
  cli: {
    migrationsDir: "./TypeORM/MigrationsTests",
    entitiesDir: "./src/Domain/Entities",
  },
});