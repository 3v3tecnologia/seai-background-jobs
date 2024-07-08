import { sendUserAccountService } from "../../services/factories/send-user-account-notification.js";
import { SendUserAccountNotification } from "../send-user-account-notification.js";

export const sendUserAccountNotification = new SendUserAccountNotification(
  sendUserAccountService
);
