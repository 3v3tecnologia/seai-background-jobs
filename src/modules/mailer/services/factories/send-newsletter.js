import { SendEmailService } from "../../infra/services/send-email.js";
import { newsletterServiceAPI } from "../../infra/services/newsletter.js";
import { SendNewsletterEmail } from "../send-newsletter.js";

const sendNewsletterEmailService = new SendNewsletterEmail(
  newsletterServiceAPI,
  new SendEmailService()
);

export { sendNewsletterEmailService };
