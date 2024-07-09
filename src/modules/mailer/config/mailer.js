const MAILER_TRANSPORT_CONFIG = {
  port: Number(process.env.MAIL_PORT),
  host: process.env.MAIL_HOST,
  secure: Number(process.env.MAIL_PORT) === 465 ? true : false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
};

const MAILER_OPTIONS = {
  from: MAILER_TRANSPORT_CONFIG.auth.user || "sender-test@gmail.com",
  to: "test@gmail.com", //???
};

export { MAILER_OPTIONS, MAILER_TRANSPORT_CONFIG };
