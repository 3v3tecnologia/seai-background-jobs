import { SendEmailService } from "../../infra/services/send-email.js";
import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { SendUserAccountService } from "../send-user-account-notification.js";

const sendUserAccountService = new SendUserAccountService(
  new SendEmailService(),
  new HtmlTemplateEngineAdapter()
);

export { sendUserAccountService };
