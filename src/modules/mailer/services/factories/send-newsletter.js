import { SendEmailService } from "../../infra/mailer.js";
import { NewsletterApi } from "../../infra/api/newsletter.service.js";
import { SendNewsletterEmailService } from "../send-newsletter.service.js";

const sendNewsletterEmailService = new SendNewsletterEmailService(
  new NewsletterApi(),
  new SendEmailService()
);

export { sendNewsletterEmailService };
