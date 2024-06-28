import pgBoss from "pg-boss";
import { databaseConfig } from "../../config/index.js";

export const pgBossConnection = new pgBoss({
  database: databaseConfig.jobs.database,
  port: databaseConfig.jobs.port,
  host: databaseConfig.jobs.host,
  password: databaseConfig.jobs.password,
  user: databaseConfig.jobs.user,
});
