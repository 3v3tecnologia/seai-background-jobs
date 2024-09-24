import pgBoss from "pg-boss";
import { jobsDatabaseCredentials } from "../config/app.js";

export const pgBossConnection = new pgBoss({
  database: jobsDatabaseCredentials.database,
  port: jobsDatabaseCredentials.port,
  host: jobsDatabaseCredentials.host,
  password: jobsDatabaseCredentials.password,
  user: jobsDatabaseCredentials.user,
});
