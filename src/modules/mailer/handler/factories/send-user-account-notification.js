import { accountNotificationService } from "../../services/factories/send-user-account-notification.js";
import { UserAccountNotification } from "../user-account-notification.js";

export const sendUserAccountNotification = new UserAccountNotification(
  accountNotificationService
);
