import { makeSendAccountNotificationHandler } from "../../factories/handlers/send-account-notification.js";
import { AccountNotificationDTO } from "../../handlers/account-notification/dto.js";

async function runner() {
  await makeSendAccountNotificationHandler().handler([
    {
      data: {
        to: "davispenha@gmail.com",
        subject: "CONTA",
        action: "createUserAccount",
        token: "1234",
      },
    },
  ]);
}

runner();
