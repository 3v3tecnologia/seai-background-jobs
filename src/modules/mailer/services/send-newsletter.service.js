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
      const { id } = command;

      Logger.info({
        msg: `Iniciando envio de emails da notícia ${id}`,
      });

      const news = await this.#newsletterService.getNewsById(id);

      if (news === null) {
        return Left.create(new Error(`Notícia ${id} não existe`));
      }

      const subscribers =
        await this.#newsletterService.getAllRecipientsEmails();

      if (subscribers === null) {
        Logger.warn({
          msg: `Não há leitores inscritos na notícia ${id}`,
        });

        await this.#newsletterService.updateNewsletterSendAt({
          id: id,
          date: new Date(),
        });

        return Left.create(new Error("Deve haver no mínimo um destinatário"));
      }

      const templateFile = await templateFiles.getTemplate("newsletter");

      const buffer = Buffer.from(news.Data);

      const newsletterContent = buffer.toString("utf-8");
      // const html = await blobToHTML(bufferToBlob(news.Data));

      const html = await this.#htmlTemplateCompiler.compile({
        file: templateFile,
        args: {
          unsubscribe_url: "",
          contact: SUPPORT_CONTACT,
          content: newsletterContent,
        },
      });

      Logger.info({
        msg: "Enviando newsletter...",
      });

      await this.#sendMail.send({
        to: subscribers.join(","),
        subject: "NEWSLETTER",
        html,
        cc: "*******",
      });

      Logger.info({
        msg: "Newsletter enviada com sucesso...",
      });

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
