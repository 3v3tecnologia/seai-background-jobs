import { newsletterServiceAPI } from "../../infra/api/newsletter.service.js";
import { SendEmailService } from "../../infra/api/send-email.service.js";
import { SendNewsletterEmail } from "../send-newsletter.service.js";

const sendNewsletterEmailService = new SendNewsletterEmail(
  newsletterServiceAPI,
  new SendEmailService()
);

export { sendNewsletterEmailService };
