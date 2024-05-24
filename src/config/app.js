import "dotenv/config";

// config({
//   path: ".env",
// });

export const env = process.env.NODE_ENV || "test";

const databaseCredentials = {
  development: {
    logs: {
      client: "pg",
      connection: {
        host: process.env.DB_LOGS_HOST_DEV,
        port: Number(process.env.DB_LOGS_PORT_DEV),
        user: process.env.DB_LOGS_USER_NAME_DEV,
        password: process.env.DB_LOGS_PASSWORD_DEV,
        database: "logs",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
    jobs: {
      // client: "pg",
      host: process.env.DB_JOB_HOST_DEV,
      port: Number(process.env.DB_JOB_PORT_DEV),
      user: process.env.DB_JOB_USER_NAME_DEV,
      password: process.env.DB_JOB_PASSWORD_DEV,
      database: process.env.DB_JOB_NAME_DEV,
    },
  },
  production: {
    logs: {
      client: "pg",
      connection: {
        host: process.env.DB_LOGS_HOST_PROD,
        port: Number(process.env.DB_LOGS_PORT_PROD),
        user: process.env.DB_LOGS_USER_NAME_PROD,
        password: process.env.DB_LOGS_PASSWORD_PROD,
        database: "logs",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
    jobs: {
      // client: "pg",
      host: process.env.DB_JOB_HOST_PROD,
      port: Number(process.env.DB_JOB_PORT_PROD),
      user: process.env.DB_JOB_USER_NAME_PROD,
      password: process.env.DB_JOB_PASSWORD_PROD,
      database: process.env.DB_JOB_NAME_PROD,
    },
  },
  test: {
    logs: {
      client: "pg",
      connection: {
        host: process.env.DB_LOGS_HOST_TEST,
        port: Number(process.env.DB_LOGS_PORT_TEST),
        user: process.env.DB_LOGS_USER_NAME_TEST,
        password: process.env.DB_LOGS_PASSWORD_TEST,
        database: "logs",
      },
      pool: {
        min: 0,
        max: 10,
      },
    },
    jobs: {
      // client: "pg",
      host: process.env.DB_JOB_HOST_TEST,
      port: Number(process.env.DB_JOB_PORT_TEST),
      user: process.env.DB_JOB_USER_NAME_TEST,
      password: process.env.DB_JOB_PASSWORD_TEST,
      database: process.env.DB_JOB_NAME_TEST,
    },
  },
};

export const databaseConfig = databaseCredentials[env];
