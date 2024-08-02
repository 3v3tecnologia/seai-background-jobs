import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { SEAI_MAIN_PAGE_URL } from "../config/api.js";
import { MAILER_OPTIONS } from "../config/mailer.js";
import templateFiles from "../helpers/getTemplateFile.js";

export class SendUserIrrigationMailService {
  #htmlTemplateCompiler;
  #sendMail;

  constructor(sendMailService, htmlTemplateCompiler) {
    this.#sendMail = sendMailService;
    this.#htmlTemplateCompiler = htmlTemplateCompiler;
  }

  async execute(dto) {
    try {
      const name = dto.getName();
      const email = dto.getEmail();
      const irrigations = dto.getIrrigation();

      Logger.info(`Iniciando envio de email para  ${email}`);

      const templateFile = await templateFiles.getTemplate(
        "user_irrigation_suggestion"
      );

      const html = await this.#htmlTemplateCompiler.compile({
        file: templateFile,
        args: {
          name,
          irrigations,
          notification: dto.getNotification(),
          website_url: SEAI_MAIN_PAGE_URL,
        },
      });

      await this.#sendMail.send({
        from: MAILER_OPTIONS.from,
        to: email,
        subject: "SEAI - Recomendação de lâmina",
        html,
      });

      Logger.info(`Email enviado com sucesso para o usuário ${name}`);

      return Right.create(
        `Sucesso ao enviar email de recomendação de lâmina do usuário ${name}`
      );
    } catch (error) {
      console.error(error);

      Logger.error({
        msg: "Falha ao enviar email de recomendação de lâmina.",
        obj: error.message,
      });

      return Left.create(error);
    }
  }
}
