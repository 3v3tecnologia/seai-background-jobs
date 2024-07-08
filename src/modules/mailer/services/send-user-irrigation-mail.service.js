import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
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

      const templateOrError = await templateFiles.getTemplate(
        "user_irrigation_suggestion"
      );

      if (templateOrError.isError()) {
        return Left.create(templateOrError.error());
      }

      const template = templateOrError.value();

      const html = await this.#htmlTemplateCompiler.compile({
        file: template.file,
        args: {
          name,
          email,
          irrigations,
          notification: dto.getNotification(),
          from: MAILER_OPTIONS.from,
          subject: template.info.subject,
        },
      });

      await this.#sendMail.send({
        from: MAILER_OPTIONS.from,
        to: email,
        subject: template.info.subject,
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
