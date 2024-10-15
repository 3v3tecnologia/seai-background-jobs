
import { MAILER_OPTIONS } from "../../config/mailer.js";
import { EmailSender } from '../../infra/email-sender.js';
import { NEWSLETTER_UNSUBSCRIBE_SITE } from "../config/redirect_links.js";
import { SUPPORT_CONTACT } from "../config/support_contact.js";

export class SendNewsletterEmail extends EmailSender {
  #newsletterAPI;

  constructor(newsletterAPI, sendMailAdapter, htmlTemplateCompiler) {
    super(sendMailAdapter, htmlTemplateCompiler);
    this.#newsletterAPI = newsletterAPI;
    this.templateName = "daily-newsletter";
  }

  async execute({ email, content, user_code }) {
    // Current date in YYYY-MM-DD format
    const date = new Date().toISOString().split('T')[0]

    await this.sendEmail({
      to: email,
      from: MAILER_OPTIONS.from,
      subject: "SEAI - NOTÍCIAS",
      templateName: this.templateName,
      templateData: {
        unsubscribe_url: `${NEWSLETTER_UNSUBSCRIBE_SITE}/${user_code}`,
        contact: SUPPORT_CONTACT,
        content,
      }
    })

    await this.#newsletterAPI.markAsSent(date);

  }
}
