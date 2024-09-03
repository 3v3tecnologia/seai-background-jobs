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

  async sendToSubscriber({
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
      msg: `Enviando notícia`,
    });

    // TO-DO: schedule newsletter to send
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

      const contents = await this.#newsletterService.getNewsBySendDate(date);

      console.log("contents");
      console.log(contents);

      if (contents.length === 0) {
        return Left.create(new Error(`Notícias não encontradas`));
      }

      const subscribers =
        await this.#newsletterService.getAllRecipientsEmails();

      if (subscribers.length == 0) {
        Logger.warn({
          msg: "Não há usuários cadastrados nas notícias"
        })
      }

      const template = await templateFiles.getTemplate("newsletter");


      // INFO: Check if bulk message is a valid solution
      await Promise.all(subscribers.map((subscriber) => this.sendToSubscriber(subscriber, contents, template)))

      // E se acontecer algum erro em algum envio ou compilação de template?
      await this.#newsletterService.updateNewsletterSendAt(date);

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
