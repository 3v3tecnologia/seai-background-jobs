import { Worker } from "../../../main/workers/rabbit-mq/protocol/worker.facade.js";
import { SendUserAccountNotificationInputDTO } from "../services/dto/send-user-account-notification.js";

export class UserAccountNotificationWorker extends Worker {
  #task;
  constructor(queueServiceProvider, task) {
    super(queueServiceProvider, {
      queue: {
        name: "account_notifications",
        bind_key: "account",
      },
      consume_rate: 1,
      exchange: {
        name: "mailer.exchange",
        type: "direct",
      },
    });

    this.#task = task;
  }

  async handle(message) {
    const dto = new SendUserAccountNotificationInputDTO(JSON.parse(message));

    return await this.#task.execute(dto);
  }
}
