import { Logger } from "../../../shared/logger.js";
import { Validator } from "../../../shared/validator.js";
import { NewsletterSubscriptionDTO } from "../services/commands/newsleter-subscription.js";

export class NewsletterSubscriptionNotification {
  static worker_name = "newsletter-subscriber-notification";

  static queue_options = {
    limiter: {
      max: 100,
      duration: 5000,
    },
  };

  #newsletterSubscriptionService;

  constructor(newsletterSubscriptionService) {
    this.#newsletterSubscriptionService = newsletterSubscriptionService;
  }

  async handle(payload) {
    const payloadOrError = Validator.againstEmptyArray(
      payload,
      "Worker payload is null or undefined."
    );

    if (payloadOrError.isError()) {
      throw resultOrError.error();
    }

    // Destruct from pg-boss job payload object
    const { id, data, name } = payload[0];

    const resultOrError = await this.#newsletterSubscriptionService.execute(
      new NewsletterSubscriptionDTO(data)
    );

    if (resultOrError.isError()) {
      Logger.error({
        msg: "Falha ao enviar notificação para usuário",
        obj: resultOrError.error(),
      });
      throw resultOrError.error();
    }

    return;
  }
}
