import { config } from "dotenv";

config({
  path: ".env",
});

export const env = process.env.NODE_ENV || "test";

const databaseCredentials = {
  development: {
    equipments: {
      client: "pg",
      connection: {
        host: process.env.DATABASE_HOST_DEV,
        port: Number(process.env.DATABASE_PORT_DEV),
        user: process.env.DATABASE_USER_DEV,
        password: process.env.DATABASE_PASSWORD_DEV,
        database: "equipments",
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
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
        min: 2,
        max: 10,
      },
    },
    jobs: {
      // client: "pg",
      host: process.env.DB_JOB_HOST_DEV,
      port: Number(process.env.DB_JOB_PORT_DEV),
      user: process.env.DB_JOB_USER_NAME_DEV,
      password: process.env.DB_JOB_PASSWORD_DEV,
      database: "postgres",
    },
  },
  production: {
    equipments: {
      client: "pg",
      connection: {
        host: process.env.DATABASE_HOST_PROD,
        port: Number(process.env.DATABASE_PORT_PROD),
        user: process.env.DATABASE_USER_PROD,
        password: process.env.DATABASE_PASSWORD_PROD,
        database: "equipments",
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
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
        min: 2,
        max: 10,
      },
    },
    jobs: {
      // client: "pg",
      host: process.env.DB_JOB_HOST_PROD,
      port: Number(process.env.DB_JOB_PORT_PROD),
      user: process.env.DB_JOB_USER_NAME_PROD,
      password: process.env.DB_JOB_PASSWORD_PROD,
      database: "postgres",
    },
  },
  test: {
    equipments: {
      client: "pg",
      connection: {
        host: process.env.DATABASE_HOST_TEST,
        port: Number(process.env.DATABASE_PORT_TEST),
        user: process.env.DATABASE_USER_TEST,
        password: process.env.DATABASE_PASSWORD_TEST,
        database: "equipments",
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
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
        min: 2,
        max: 10,
      },
    },
    jobs: {
      // client: "pg",
      host: process.env.DB_JOB_HOST_TEST,
      port: Number(process.env.DB_JOB_PORT_TEST),
      user: process.env.DB_JOB_USER_NAME_TEST,
      password: process.env.DB_JOB_PASSWORD_TEST,
      database: "postgres",
    },
  },
};
export const databaseConfig = databaseCredentials[env];

export const ftpConfig = {
  host: process.env.FTP_FUNCEME_HOST,
  user: process.env.FTP_FUNCEME_USER,
  password: process.env.FTP_FUNCEME_PASSWORD,
  keepalive: 10000,
  pasvTimeout: 10000,
  connTimeout: 15000,
  port: 21,
};

export const mailerConfig = {
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
  from: process.env.MAILER_FROM || "",
  to: "",
  subject: "",
  text: "",
  html: "",
  attachments: [],
};
