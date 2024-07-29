import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { SendEmailService } from "../../infra/mailer.js";
import { SendUserAccountNotificationService } from "../user-account-notification.service.js";

const sendUserAccountService = new SendUserAccountNotificationService(
  new SendEmailService(),
  new HtmlTemplateEngineAdapter()
);

export { sendUserAccountService };
