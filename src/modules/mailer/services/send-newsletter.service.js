import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { NEWSLETTER_UNSUBSCRIBE_SITE } from "../config/redirect_links.js";
import { SUPPORT_CONTACT } from "../config/support_contact.js";
import templateFiles from "../helpers/getTemplateFile.js";

export class SendNewsletterEmailService {
  #htmlTemplateCompiler;
  #newsletterService;
  #sendMail;

  constructor(newsletterService, sendMailAdapter, htmlTemplateCompiler) {
    this.#newsletterService = newsletterService;
    this.#sendMail = sendMailAdapter;
    this.#htmlTemplateCompiler = htmlTemplateCompiler;
  }

  async sendToSubscriber(subscriber, news, template) {
    const {
      Email,
      Code
    } = subscriber

    const html = await this.#htmlTemplateCompiler.compile({
      file: template,
      args: {
        unsubscribe_url: `${NEWSLETTER_UNSUBSCRIBE_SITE}/${Code}`,
        contact: SUPPORT_CONTACT, // TO-DO: fetch from database or get from .env
        content: news.content,
      },
    });

    Logger.info({
      msg: `Enviando notícia`,
    });

    // TO-DO: schedule newsletter to send
    await this.#sendMail.send({
      to: Email,
      subject: news.title,
      html,
    })

    Logger.info({
      msg: `Message to ${Email} sent`
    })
  }

  async execute({ id, title, description, content }) {
    try {
      const existingNewsletter = await this.#newsletterService.getNewsById(id);

      if (existingNewsletter === null) {
        return Left.create(new Error(`Notícia não existe`));
      }

      const subscribers =
        await this.#newsletterService.getAllRecipientsEmails();


      // Will throw an error if there are no subscribers?

      if (subscribers.length == 0) {
        // TO-DO: 

        Logger.warn({
          msg: "Não há usuários cadastrados nas notícias"
        })
      }

      const templateFile = await templateFiles.getTemplate("newsletter");

      const newsletterContent = Buffer.from(content).toString("utf-8");

      await Promise.all(subscribers.map((subscriber) => this.sendToSubscriber(subscriber, {
        content: newsletterContent,
        title
      }, templateFile)))

      // E se acontecer algum erro em algum envio ou compilação de template?
      await this.#newsletterService.updateNewsletterSendAt({
        id: id,
        date: new Date(),
      });

      return Right.create("Sucesso ao enviar notícia");

    } catch (error) {
      Logger.error({
        msg: "Falha ao enviar notícia",
        obj: error,
      });

      return Left.create(error);
    }
  }
}
