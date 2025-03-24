
import { Logger } from "../../shared/logger.js";

export class SendNewsletterEmailService {
  #newsletterAPI;
  #queueProvider;

  constructor(newsletterAPI, queueProvider) {
    this.#newsletterAPI = newsletterAPI;
    this.#queueProvider = queueProvider;
  }

  async execute() {
    try {
      // Current date in YYYY-MM-DD format
      const date = new Date().toISOString().split('T')[0]

      const contents = await this.#newsletterAPI.getUnsentNewsBySendDate(date);

      if (contents.length === 0) {
        return
      }

      const subscribers =
        await this.#newsletterAPI.getSubscribers();


      await Promise.all(subscribers.map(({ Email, Code }) => this.#queueProvider.send("daily-newsletter", {
        email: Email,
        user_code: Code,
        content: contents
      })))

    } catch (error) {

      Logger.error({
        msg: error.message,
        obj: error
      })
    }

  }
}
