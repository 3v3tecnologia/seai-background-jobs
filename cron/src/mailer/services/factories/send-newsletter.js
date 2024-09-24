import { SendEmailService } from "../../infra/mailer.js";
import { NewsletterApi } from "../../infra/api/newsletter.service.js";
import { SendNewsletterEmailService } from "../send-newsletter.service.js";
import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";

const sendNewsletterEmailService = new SendNewsletterEmailService(
  new NewsletterApi(),
  new SendEmailService(),
  new HtmlTemplateEngineAdapter()
);

export { sendNewsletterEmailService };
