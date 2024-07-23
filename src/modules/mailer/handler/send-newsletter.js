import { Validator } from "../../../shared/validator.js";
import { SendNewsletterCommand } from "../services/commands/send-newsletter.js";

export class SendNewsletter {
  static worker_name = "SendNewsletter";

  #sendNewsletterEmailService;

  constructor(sendNewsletterEmailService) {
    this.#sendNewsletterEmailService = sendNewsletterEmailService;
  }

  async handle(payload) {
    const payloadOrError = Validator.againstEmptyArray(
      payload,
      "Worker payload is null or undefined."
    );

    if (payloadOrError.isError()) {
      Logger.error({
        msg: "Falha ao enviar notícias",
        obj: payloadOrError.error(),
      });
      throw payloadOrError.error();
    }

    // Destruct from pg-boss job payload object
    const { id, data, name } = payload[0];

    const sendNewsletterCommand = new SendNewsletterCommand(data);

    const resultOrError = await this.#sendNewsletterEmailService.execute(
      sendNewsletterCommand
    );

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