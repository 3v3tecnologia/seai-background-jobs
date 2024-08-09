import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
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

  async execute(command) {
    try {
      const { id, title, description, content } = command;

      Logger.info({
        msg: `Iniciando envio de emails da notícia`,
      });

      // TO-DO : get from database or get from params
      // const news = await this.#newsletterService.getNewsById(Id);

      if (content === null) {
        return Left.create(new Error(`Notícia não existe`));
      }

      const subscribers =
        await this.#newsletterService.getAllRecipientsEmails();

      if (subscribers === null) {
        Logger.warn({
          msg: `Não há leitores inscritos na notícia`,
        });

        // TO-DO: 
        await this.#newsletterService.updateNewsletterSendAt({
          id,
          date: new Date(),
        });

        return Left.create(new Error("Deve haver no mínimo um destinatário"));
      }

      const templateFile = await templateFiles.getTemplate("newsletter");

      const newsletterContent = Buffer.from(content).toString("utf-8");

      const emailPromises = []

      for (const subscriber of subscribers) {
        const {
          Email,
          Code
        } = subscriber

        const html = await this.#htmlTemplateCompiler.compile({
          file: templateFile,
          args: {
            unsubscribe_url: `http://test:8080/unsubscribe/${Code}`,
            contact: SUPPORT_CONTACT,
            content: newsletterContent,
          },
        });

        Logger.info({
          msg: "Enviando newsletter...",
        });

        // TO-DO: schedule newsletter to send
        emailPromises.push(this.#sendMail.send({
          to: Email,
          subject: title,
          html,
        }))
      }

      const results = await Promise.all(emailPromises)

      results.forEach(result => {
        console.log(`Message to ${result.envelope.to} sent: ${result.messageId}`);
      });

      // TO-DO: How to update send-at
      await this.#newsletterService.updateNewsletterSendAt({
        id: id,
        date: new Date(),
      });

      return Right.create("Sucesso ao enviar notícia");
    } catch (error) {
      Logger.error({
        msg: "Falha ao enviar notícias.",
        obj: error,
      });

      return Left.create(error);
    }
  }
}
