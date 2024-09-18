import { Logger } from "../../../shared/logger.js";
import { Left, Right } from "../../../shared/result.js";
import { MAILER_OPTIONS } from "../config/mailer.js";
import { ACCOUNT_REDIRECT_LINK } from "../config/redirect_links.js";
import { SUPPORT_CONTACT } from "../config/support_contact.js";
import MAIL_TEMPLATES from "../helpers/getTemplateFile.js";

export class AccountNotificationService {
  htmlTemplateCompiler;
  sendMail;

  constructor(sendMailService, htmlTemplateCompiler) {
    this.sendMail = sendMailService;
    this.htmlTemplateCompiler = htmlTemplateCompiler;
  }

  async createHTMLTemplate({
    user,
    operation,
    redirect_url
  } = {
      user: {
        code: '',
        email: ''
      },
      operation: '',
      redirect_url: '',
    }) {
    console.log({
      user,
      operation,
      redirect_url
    });

    const template = await MAIL_TEMPLATES.getTemplate(operation);

    return await this.htmlTemplateCompiler.compile({
      file: template,
      args: {
        redirect_url: redirect_url[operation] + `/${user.code}`,
        contact: SUPPORT_CONTACT,
      },
    });
  }

  async execute({ email, user_code, user_type, action }) {
    try {

      Logger.info(`Iniciando envio de email para  ${email}`);


      const html = await this.createHTMLTemplate({
        user: {
          code: user_code,
          email: email,
        },
        operation: action,
        redirect_url: ACCOUNT_REDIRECT_LINK[user_type][action],
      })


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
