import { SendUserAccountNotificationCommand } from "../../../modules/mailer/services/commands/send-user-account-notification.js";
import { sendUserAccountService } from "../../../modules/mailer/services/factories/send-user-account-notification.js";
import { Validator } from "../../../shared/validator.js";

export class SendUserAccountNotificationWorker {
  static worker_name = "SendUserAccountNotification";

  static queue_options = {
    limiter: {
      max: 100,
      duration: 5000,
    },
  };

  static async handler(payload) {
    /*
      [
        {
          id: 'ce4200a1-feff-4273-8d81-a22287caba8d',
          name: 'user-account-notification',
          priority: 2,
          data: {
            email: 'davi1321@3v3.com.br',
            base64Code: 'ZGF2aTEzMjFAM3YzLmNvbS5icg==',
            templateName: 'createUserAccount'
          },
          state: 'active',
          retrylimit: 1,
          retrycount: 0,
          retrydelay: 60,
          retrybackoff: false,
          startafter: 2024-05-17T10:25:20.032Z,
          startedon: 2024-05-17T10:25:20.688Z,
          singletonkey: null,
          singletonon: null,
          expirein: PostgresInterval { minutes: 15 },
          createdon: 2024-05-17T10:25:20.032Z,
          completedon: null,
          keepuntil: 2024-05-31T10:25:20.032Z,
          on_complete: false,
          output: null,
          expire_in_seconds: '900.000000'
        }
      ]
    */
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
      throw resultOrError.error();
    }

    return;
  }
}
