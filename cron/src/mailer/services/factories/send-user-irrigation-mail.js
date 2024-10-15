import { SendEmailService } from "../../infra/mailer.js";
import { PgQueue } from "../../infra/queue/pg.js";
import { SendIrrigationReportsService } from "../send-user-irrigation-mail.service.js";

const sendUserIrrigationMailService = new SendIrrigationReportsService(
  new SendEmailService(),
  new PgQueue()
);

export { sendUserIrrigationMailService };
