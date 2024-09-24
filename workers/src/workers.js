import { pgBossWorker } from "./lib/worker.js";
import { AccountNotificationInput } from "./mailer/services/dto/send-user-account-notification.js";
import { accountNotificationService } from "./mailer/services/factories/send-user-account-notification.js";

export default [
    {
        queue_name: "user-account-notification",
        // Destruct from pg-boss job payload object
        worker: (command) => pgBossWorker(accountNotificationService)(new AccountNotificationInput(command[0].data)),
    },

];