import { NewsletterApi } from "../../infra/api/newsletter.service.js";
import { RabbitMqAdapter } from "../../infra/queue/rabbitmq/rabbitmq.js";
import { SendNewsletterEmailService } from "../send-newsletter.service.js";

const sendNewsletterEmailService = new SendNewsletterEmailService(
  new NewsletterApi(),
  new RabbitMqAdapter(RABBIT_MQ_URL)
);

export { sendNewsletterEmailService };
