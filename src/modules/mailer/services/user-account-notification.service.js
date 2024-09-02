import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { MAILER_OPTIONS } from "../config/mailer.js";
import { SUPPORT_CONTACT } from "../config/support_contact.js";
import templateFiles from "../helpers/getTemplateFile.js";

export class SendUserAccountNotificationService {
  htmlTemplateCompiler;
  sendMail;
  constructor(sendMailService, htmlTemplateCompiler) {
    this.sendMail = sendMailService;
    this.htmlTemplateCompiler = htmlTemplateCompiler;
  }

  async execute(command) {
    try {
      const { email, redirect_url, action } = command;

      Logger.info(`Iniciando envio de email para  ${email}`);

      // "forgot-user-account"  | "create-user-account"
      const templateFile = await templateFiles.getTemplate(action);

      const html = await this.htmlTemplateCompiler.compile({
        file: templateFile,
        args: {
          redirect_url,
          contact: SUPPORT_CONTACT,
        },
      });

      await this.sendMail.send({
        from: MAILER_OPTIONS.from,
        to: email,
        subject: "SEAI - Verifique o seu email",
        html,
      });

      Logger.info(`Email enviado com sucesso`);

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
