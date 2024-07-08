import "dotenv/config";

export const env = process.env.NODE_ENV || "test";

export const jobsDatabaseCredentials = {
  host: process.env.DB_JOB_HOST,
  port: Number(process.env.DB_JOB_PORT),
  user: process.env.DB_JOB_USER_NAME,
  password: process.env.DB_JOB_PASSWORD,
  database: process.env.DB_JOB_NAME,
};
