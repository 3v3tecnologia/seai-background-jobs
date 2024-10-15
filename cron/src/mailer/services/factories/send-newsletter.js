import { NewsletterApi } from "../../infra/api/newsletter.service.js";
import { PgQueue } from "../../infra/queue/pg.js";
import { SendNewsletterEmailService } from "../send-newsletter.service.js";

const sendNewsletterEmailService = new SendNewsletterEmailService(
  new NewsletterApi(),
  new PgQueue()
);

export { sendNewsletterEmailService };
