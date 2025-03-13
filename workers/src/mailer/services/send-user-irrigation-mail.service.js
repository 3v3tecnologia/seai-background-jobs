
import { IRRIGANT_WEBPAGE } from '../../config/api.js';
import { MAILER_OPTIONS } from '../../config/mailer.js';
import { EmailSender } from '../../infra/email-sender.js';

export class SendUserIrrigationMail extends EmailSender {
  constructor(sendMailService, htmlTemplateCompiler) {
    super(sendMailService, htmlTemplateCompiler);
    this.templateName = "irrigation-suggestion";
  }

  async execute({ email, irrigation } = { email: '', irrigation: { Name: '', Irrigation: [], Notification: '' } }) {
    await this.sendEmail({
      to: email,
      from: MAILER_OPTIONS.from,
      subject: "SEAI - Recomendação de lâmina",
      templateName: this.templateName,
      templateData: {
        name: irrigation.Name,
        irrigations: irrigation.Irrigation,
        notification: irrigation.Notification,
        website_url: IRRIGANT_WEBPAGE,
      },
    })
  }
}
