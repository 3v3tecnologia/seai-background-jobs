import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { MAILER_OPTIONS } from "../config/mailer.js";
import { getTemplate } from "../helpers/getTemplateFile.js";

export class SendUserAccountService {
  htmlTemplateCompiler;
  sendMail;
  constructor(sendMailService, htmlTemplateCompiler) {
    this.sendMail = sendMailService;
    this.htmlTemplateCompiler = htmlTemplateCompiler;
  }

  async execute(command) {
    try {
      const email = command.getEmail();
      const code = command.getCode();
      const templateName = command.getTemplateName();

      Logger.info(`Iniciando envio de email para  ${email}`);

      const templateOrError = await getTemplate(templateName);

      if (templateOrError.isError()) {
        return Left.create(templateOrError.error());
      }

      const template = templateOrError.value();

      console.log({
        file: template.file,
        args: {
          user_code: code,
          user_email: email,
          from: MAILER_OPTIONS.from,
          subject: template.info.subject,
          service_url: template.info.service_url,
        },
      });

      const html = await this.htmlTemplateCompiler.compile({
        file: template.file,
        args: {
          user_code: code,
          user_email: email,
          from: MAILER_OPTIONS.from,
          subject: template.info.subject,
          service_url: template.info.service_url,
        },
      });

      await this.sendMail.send({
        from: MAILER_OPTIONS.from,
        to: email,
        subject: template.info.subject,
        html,
      });

      Logger.info(`Email para cadastro de usuário enviado com sucesso`);

      return Right.create(`Sucesso ao enviar email`);
    } catch (error) {
      console.error(error);
      Logger.error({
        msg: "Falha ao enviar email.",
        obj: error.message,
      });

      return Left.create(error);
    }
  }
}
