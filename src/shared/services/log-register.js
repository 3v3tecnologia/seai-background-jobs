import { Logger } from "../logger.js";

export class DatabaseLogger {
  source;
  context;

  constructor(source,context) {
    this.source = source;
    this.context = context
  }

  warn(message ) {
    Logger.warn({
      msg:message
    })

    this.source.save({
      Status: 'warn',
      Message: message,
      Context: this.context
    })
  }

  info(message) {
    Logger.info({
      msg:message
    })

    this.source.save({
      Status: 'info',
      Message: message,
      Context: this.context
    })
  }

  error(message) {
    Logger.error({
      msg:message
    })

    this.source.save({
      Status: 'error',
      Message: message,
      Context: this.context
    })
  }
}
