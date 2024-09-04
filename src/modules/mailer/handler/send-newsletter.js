import { Logger } from '../../../shared/logger.js';

export class SendNewsletter {
  static worker_name = "SendNewsletter";

  #sendNewsletterEmailService;

  constructor(sendNewsletterEmailService) {
    this.#sendNewsletterEmailService = sendNewsletterEmailService;
  }

  async handle(payload) {

    const resultOrError = await this.#sendNewsletterEmailService.execute();

    if (resultOrError.isError()) {
      Logger.error({
        msg: "Falha ao enviar notícias",
        obj: resultOrError.error(),
      });
      throw resultOrError.error();
    }

    return;
  }
}
