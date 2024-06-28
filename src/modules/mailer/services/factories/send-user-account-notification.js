import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { sendNewsletterEmailService } from "./send-newsletter.js";
import { SendUserAccountService } from "../send-user-account-notification.service.js";

const sendUserAccountService = new SendUserAccountService(
  new sendNewsletterEmailService(),
  new HtmlTemplateEngineAdapter()
);

export { sendUserAccountService };
