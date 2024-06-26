import { SendNewsletterCommand } from "../../../modules/mailer/services/commands/send-newsletter.js";
import { sendNewsletterEmailService } from "../../../modules/mailer/services/factories/send-newsletter.js";
import { Validator } from "../../../shared/validator.js";

export class SendNewsletterWorker {
  static worker_name = "SendNewsletter";

  static async handler(payload) {
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

    const resultOrError = await sendNewsletterEmailService.execute(
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
