
import { Logger } from "../../shared/logger.js";
import { Left, Right } from "../../shared/result.js";
import { MAILER_OPTIONS } from "../config/mailer.js";
import { IRRIGANT_WEBPAGE } from "../config/redirect_links.js";
import templateFiles from "../helpers/getTemplateFile.js";
import { IrrigationRecommendationsService } from "../infra/api/irrigation.service.js";

export class SendUserIrrigationMailService {
  #htmlTemplateCompiler;
  #sendMail;

  constructor(sendMailService, htmlTemplateCompiler) {
    this.#sendMail = sendMailService;
    this.#htmlTemplateCompiler = htmlTemplateCompiler;
  }

  async execute() {
    const abortController = new AbortController();

    try {
      const currentDate = new Date();
      // Schedule to 9hrs AM
      currentDate.setHours(9, 0, 0, 0);

      // Convert a stream of text in a binary encoding into strings
      const decoderStream = new TextDecoder("utf-8");

      const responseStream =
        await new IrrigationRecommendationsService().getIrrigationsPerUserDataStream(
          abortController.signal
        );

      while (true) {
        const { value, done } = await responseStream.read();

        if (done) {
          break;
        }

        const data = decoderStream.decode(value, { stream: true });

        if (data) {
          const {
            Name,
            Email,
            Irrigation,
            Notification
          } = JSON.parse(data)

          Logger.info({
            msg: `Iniciando envio de email para  ${Email}`
          });

          const templateFile = await templateFiles.getTemplate(
            "user_irrigation_suggestion"
          );

          const html = await this.#htmlTemplateCompiler.compile({
            file: templateFile,
            args: {
              name: Name,
              irrigations: Irrigation,
              notification: Notification,
              website_url: IRRIGANT_WEBPAGE,
            },
          });

          await this.#sendMail.send({
            from: MAILER_OPTIONS.from,
            to: Email,
            subject: "SEAI - Recomendação de lâmina",
            html,
          });

          Logger.info({
            msg: `Email enviado com sucesso para o usuário ${Name}`
          });
        }
      }

      Logger.info({
        msg: `Sucesso ao enviar relatórios de recomendação de lâmina`
      });

      return Right.create()

    } catch (error) {
      abortController.abort();

      Logger.error({
        msg: "Falha ao agendar envio de emails das recomendações de lâmina",
        obj: error,
      });

      return Left.create(error);

    }
  }
}
