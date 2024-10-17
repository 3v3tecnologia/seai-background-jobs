
import { IRRIGANT_WEBPAGE } from '../../config/api.js';
import { MAILER_OPTIONS } from '../../config/mailer.js';
import { EmailSender } from '../../infra/email-sender.js';

export class SendUserIrrigationMail extends EmailSender {
  constructor(sendMailService, htmlTemplateCompiler) {
    super(sendMailService, htmlTemplateCompiler);
    this.templateName = "irrigation-suggestion";
  }

  async execute({ email, irrigation } = { email: '', irrigation: { name: '', irrigations: [], notification: '' } }) {
    await this.sendEmail({
      to: email,
      from: MAILER_OPTIONS.from,
      subject: "SEAI - Recomendação de lâmina",
      templateName: this.templateName,
      templateData: {
        name: Name,
        irrigations: irrigation.irrigations,
        notification: irrigation.notification,
        website_url: IRRIGANT_WEBPAGE,
      },
    })
  }
}
