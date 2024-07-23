import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { SendEmailService } from "../../infra/mailer.js";
import { SendNewsletterSubscriptionMailService } from "../newsleter-subscription.service.js";

const sendNewsletterSubscriptionNotification =
  new SendNewsletterSubscriptionMailService(
    new SendEmailService(),
    new HtmlTemplateEngineAdapter()
  );
export { sendNewsletterSubscriptionNotification };
