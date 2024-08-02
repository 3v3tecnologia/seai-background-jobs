import { Logger } from "../../../shared/logger.js";
import { Validator } from "../../../shared/validator.js";
import { SendUserAccountNotificationInputDTO } from "../services/dto/send-user-account-notification.js";

export class SendUserAccountNotification {
  static worker_name = "SendUserAccountNotification";

  static queue_options = {
    limiter: {
      max: 100,
      duration: 5000,
    },
  };

  #sendUserAccountService;

  constructor(sendUserAccountService) {
    this.#sendUserAccountService = sendUserAccountService;
  }

  async handle(payload) {
    const payloadOrError = Validator.againstEmptyArray(
      payload,
      "Worker payload is null or undefined."
    );

    if (payloadOrError.isError()) {
      throw resultOrError.error();
    }

    // Destruct from pg-boss job payload object
    const { data } = payload[0];

    const inviteUserCommand = new SendUserAccountNotificationInputDTO(data);

    const resultOrError = await this.#sendUserAccountService.execute(
      inviteUserCommand
    );

    if (resultOrError.isError()) {
      Logger.error({
        msg: "Falha ao enviar notificação para usuário",
        obj: resultOrError.error(),
      });
      throw resultOrError.error();
    }

    return;
  }
}
