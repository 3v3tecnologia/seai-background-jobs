import { SendEmailService } from "../../infra/api/send-email.service.js";
import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { SendUserIrrigationMail } from "../send-user-irrigation-mail.service.js";

const sendUserIrrigationMailService = new SendUserIrrigationMail(
  new SendEmailService(),
  new HtmlTemplateEngineAdapter()
);

export { sendUserIrrigationMailService };
