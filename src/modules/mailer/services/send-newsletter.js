import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";

export class SendNewsletterEmail {
  constructor(newsletterService, sendMailAdapter) {
    this.newsletterService = newsletterService;
    this.sendMail = sendMailAdapter;
  }

  async execute(command) {
    try {
      const idNews = command.getNewsId();

      Logger.info({
        msg: `Iniciando envio de emails da notícia ${idNews}`,
      });

      const news = await this.newsletterService.getNewsById(idNews);

      if (news === null) {
        return Left.create(new Error(`Notícia ${idNews} não existe`));
      }

      const subscribers = await this.newsletterService.getAllRecipientsEmails();

      if (subscribers === null) {
        Logger.warn({
          msg: `Não há leitores inscritos na notícia ${idNews}`,
        });

        return Left.create(new Error("Deve haver no mínimo um destinatário"));
      }

      const buffer = Buffer.from(news.Data);

      const html = buffer.toString("utf-8");
      // const html = await blobToHTML(bufferToBlob(news.Data));

      Logger.info({
        msg: "Enviando newsletter...",
      });

      await this.sendMail.send({
        to: subscribers.join(","),
        subject: "NEWSLETTER",
        html,
        cc: "*******",
      });

      Logger.info({
        msg: "Newsletter enviada com sucesso...",
      });

      await this.newsletterService.updateNewsletterSendAt({
        id: idNews,
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
