import { env } from "../../../config/index.js";

const serverCredentials = {
  development: {
    port: Number(process.env.MAIL_PORT_DEV),
    host: process.env.MAIL_HOST_DEV,
    auth: {
      user: process.env.MAIL_USERNAME_DEV,
      pass: process.env.MAIL_PASSWORD_DEV,
    },
  },
  production: {
    port: Number(process.env.MAIL_PORT_PROD),
    host: process.env.MAIL_HOST_PROD,
    auth: {
      user: process.env.MAIL_USERNAME_PROD,
      pass: process.env.MAIL_PASSWORD_PROD,
    },
  },
  test: {
    port: Number(process.env.MAIL_PORT_TEST),
    host: process.env.MAIL_HOST_TEST,
    auth: {
      user: process.env.MAIL_USERNAME_TEST,
      pass: process.env.MAIL_PASSWORD_TEST,
    },
  },
};

const MAILER_TRANSPORT_CONFIG = serverCredentials[env];

const MAILER_OPTIONS = {
  from: MAILER_TRANSPORT_CONFIG.auth.user,
  to: "test@gmail.com", //???
};

export { MAILER_TRANSPORT_CONFIG, MAILER_OPTIONS };
