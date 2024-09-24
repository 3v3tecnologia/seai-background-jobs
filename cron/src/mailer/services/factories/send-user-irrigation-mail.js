import { SendEmailService } from "../../infra/mailer.js";
import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { SendUserIrrigationMailService } from "../send-user-irrigation-mail.service.js";

const sendUserIrrigationMailService = new SendUserIrrigationMailService(
  new SendEmailService(),
  new HtmlTemplateEngineAdapter()
);

export { sendUserIrrigationMailService };
