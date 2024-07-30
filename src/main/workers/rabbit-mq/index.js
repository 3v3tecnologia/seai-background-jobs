import "dotenv/config.js";
import { sendNewsletterEmailService } from "../../../modules/mailer/services/factories/send-newsletter.js";
import { sendUserAccountService } from "../../../modules/mailer/services/factories/send-user-account-notification.js";
import { UserAccountNotificationWorker } from "../../../modules/mailer/workers/create-user-notification.js";
import { SendNewsletterWorker } from "../../../modules/mailer/workers/scheduled/send-newsletter.js";
import { RABBIT_MQ_URI } from "../../config/message-queue.js";
import { RabbitMqServer } from "../../lib/queue/rabbitmq.js";

(async () => {
  try {
    const rabbitMQServer = RabbitMqServer.create(RABBIT_MQ_URI);

    await rabbitMQServer.start();

    const workers = [
      new UserAccountNotificationWorker(rabbitMQServer, sendUserAccountService),
      new SendNewsletterWorker(rabbitMQServer, sendNewsletterEmailService),
    ];

    process.once("SIGINT", async () => {
      await rabbitMQServer.close();
    });

    console.log("To exit press CTRL+C");

    for (const worker of workers) {
      await worker.start();
    }
  } catch (error) {
    console.warn(error);
  }
})();
