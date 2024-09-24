
import { Logger } from "../../shared/logger.js";
import { Left, Right } from "../../shared/result.js";
import { NEWSLETTER_UNSUBSCRIBE_SITE } from "../config/redirect_links.js";
import { SUPPORT_CONTACT } from "../config/support_contact.js";
import templateFiles from "../helpers/getTemplateFile.js";

export class SendNewsletterEmailService {
  #htmlTemplateCompiler;
  #newsletterAPI;
  #sendMail;

  constructor(newsletterAPI, sendMailAdapter, htmlTemplateCompiler) {
    this.#newsletterAPI = newsletterAPI;
    this.#sendMail = sendMailAdapter;
    this.#htmlTemplateCompiler = htmlTemplateCompiler;
  }

  async #sendToSubscriber({
    Email,
    Code
  }, content = [], template) {

    const html = await this.#htmlTemplateCompiler.compile({
      file: template,
      args: {
        unsubscribe_url: `${NEWSLETTER_UNSUBSCRIBE_SITE}/${Code}`,
        contact: SUPPORT_CONTACT,
        content,
      },
    });

    Logger.info({
      msg: `Enviando notícia`
    });

    await this.#sendMail.send({
      to: Email,
      subject: "SEAI - NOTÍCIAS",
      html,
    })

    Logger.info({
      msg: `Message to ${Email} sent`
    })
  }

  async execute() {
    try {
      // Current date in YYYY-MM-DD format
      const date = new Date().toISOString().split('T')[0]

      const contents = await this.#newsletterAPI.getUnsentNewsBySendDate(date);

      if (contents.length === 0) {
        Logger.warn({
          msg: `Notícias não encontradas`
        })
        return Right.create()
      }

      const subscribers =
        await this.#newsletterAPI.getSubscribers();

      if (subscribers.length == 0) {
        Logger.warn({
          msg: "Não há usuários cadastrados nas notícias"
        })
      }

      const template = await templateFiles.getTemplate("newsletter");

      // INFO: Check if bulk message is a valid solution
      await Promise.all(subscribers.map((subscriber) => this.#sendToSubscriber(subscriber, contents, template)))

      // E se acontecer algum erro em algum envio ou compilação de template?
      await this.#newsletterAPI.markAsSent(date);

      return Right.create()
    } catch (error) {
      return Left.create(error);
    }

  }
}
