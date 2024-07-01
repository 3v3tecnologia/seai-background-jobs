import { SendUserAccountNotificationCommand } from "../services/commands/send-user-account-notification.js";
import { sendUserAccountService } from "../services/factories/send-user-account-notification.js";
import { Validator } from "../../../shared/validator.js";

export class SendUserAccountNotification {
  static worker_name = "SendUserAccountNotification";

  static queue_options = {
    limiter: {
      max: 100,
      duration: 5000,
    },
  };

  static async handler(payload) {
    const payloadOrError = Validator.againstEmptyArray(
      payload,
      "Worker payload is null or undefined."
    );

    if (payloadOrError.isError()) {
      throw resultOrError.error();
    }

    // Destruct from pg-boss job payload object
    const { id, data, name } = payload[0];

    const inviteUserCommand = new SendUserAccountNotificationCommand(data);

    const resultOrError = await sendUserAccountService.execute(
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
