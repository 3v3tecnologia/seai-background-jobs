import { env } from './env.js'

/**
 * Use a dedicated bulk delivery provider: 
 * use a provider that offers a dedicated SMTP for bulk email 
*/
const MAILER_TRANSPORT_CONFIG = {
  port: Number(process.env.MAIL_PORT),
  host: process.env.MAIL_HOST,
  secure: Number(process.env.MAIL_PORT) === 465 ? true : false,
  pool: true, // Use SMTP pooling to keep the connection open for multiple emails
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  debug: env === 'debug', // show debug output
  logger: true, // log information in console
  maxMessages: Infinity, // Allow an unlimited number of messages per connection
  maxConnections: 5 // Limit the number of simultaneous connections
};

const MAILER_OPTIONS = {
  from: process.env.EMAIL_SENDER,
};

export { MAILER_OPTIONS, MAILER_TRANSPORT_CONFIG };
