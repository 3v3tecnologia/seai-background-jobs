import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { MAILER_OPTIONS } from "../config/mailer.js";
import templateFiles from "../helpers/getTemplateFile.js";

export class SendNewsletterSubscriptionMailService {
  #htmlTemplateCompiler;
  #sendMail;

  constructor(sendMailService, htmlTemplateCompiler) {
    this.#sendMail = sendMailService;
    this.#htmlTemplateCompiler = htmlTemplateCompiler;
  }

  async execute(dto) {
    try {
      const { email, link } = dto;

      Logger.info(`Iniciando envio de email para  ${email}`);

      const templateOrError = await templateFiles.getTemplate(
        "newsletter-subscription"
      );

      if (templateOrError.isError()) {
        return Left.create(templateOrError.error());
      }

      const template = templateOrError.value();

      const html = await this.#htmlTemplateCompiler.compile({
        file: template.file,
        args: {
          link,
        },
      });

      await this.#sendMail.send({
        from: MAILER_OPTIONS.from,
        to: email,
        subject: template.info.subject,
        html,
      });

      return Right.create(`Email enviado com sucesso para o usuário ${email}`);
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
