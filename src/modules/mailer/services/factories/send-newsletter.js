import { DbNewsLetterRepository } from "../../database/repositories/Newsletter.js";
import { SendEmailService } from "../../external/send-email.js";
import { SendNewsletterEmail } from "../send-newsletter.js";

const sendNewsletterEmailService = new SendNewsletterEmail(
  new DbNewsLetterRepository(),
  new SendEmailService()
);

export { sendNewsletterEmailService };
