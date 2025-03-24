import { ASYNC_JOB_URL } from "../../infra/queue/pg-boss/connection.js";
import { NewsletterApi } from "../../infra/api/newsletter.service.js";
import { PgBossMqAdapter } from "../../infra/queue/pg-boss/pgBoss.js";
import { SendNewsletterEmailService } from "../send-newsletter.service.js";

const sendNewsletterEmailService = new SendNewsletterEmailService(
  new NewsletterApi(),
  new PgBossMqAdapter(ASYNC_JOB_URL)
);

export { sendNewsletterEmailService };
