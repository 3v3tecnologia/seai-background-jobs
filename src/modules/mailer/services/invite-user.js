import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { SEAI_API } from "../config/api.js";
import { MAILER_OPTIONS } from "../config/mailer.js";
import { getTemplate } from "../helpers/getTemplateFile.js";

export class InviteUserService {
  constructor({ sendMailService, htmlTemplateCompiler }) {
    this.sendMail = sendMailService;
    this.htmlTemplateCompiler = htmlTemplateCompiler;
  }

  async execute(command) {
    try {
      const { user, templateName } = command;

      Logger.info(`Iniciando envio de email para  ${user.email}`);

      const templateOrError = await getTemplate(templateName);

      if (templateOrError.isError()) {
        return Left.create(templateOrError.error());
      }

      const template = templateOrError.value();

      const html = await this.htmlTemplateCompiler.compile({
        file: template.file,
        args: {
          user_code: user.code,
          user_email: user.email,
          from: MAILER_OPTIONS.from,
          subject: template.subject,
          service_url: SEAI_API.ACCOUNT.CREATE_USER,
        },
      });

      await this.sendMail.send({
        from: MAILER_OPTIONS.from,
        to: user.email,
        subject: template.subject,
        html,
      });

      Logger.info(`Email para cadastro de usuário enviado com sucesso`);

      return Right.create(`Sucesso ao enviar email`);
    } catch (error) {
      Logger.error({
        msg: "Falha ao enviar email.",
        obj: error.message,
      });

      return Left.create(error);
    }
  }
}
