import { InviteUserCommand } from "../../../modules/mailer/services/commands/invite-user.js";
import { inviteUserService } from "../../../modules/mailer/services/factories/invite-user.js";
import { Validator } from "../../../shared/validator.js";

export class SendUserAccountNotificationWorker {
  static worker_name = "InviteUser";

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

    const inviteUserCommand = new InviteUserCommand(data);

    const resultOrError = await inviteUserService.execute(inviteUserCommand);

    if (resultOrError.isError()) {
      throw resultOrError.error();
    }

    return;
  }
}
