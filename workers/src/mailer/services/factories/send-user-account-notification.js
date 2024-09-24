import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { SendEmailService } from "../../infra/mailer.js";
import { AccountNotificationService } from "../account-notification.service.js"

export const accountNotificationService = new AccountNotificationService(
  new SendEmailService(),
  new HtmlTemplateEngineAdapter()
)