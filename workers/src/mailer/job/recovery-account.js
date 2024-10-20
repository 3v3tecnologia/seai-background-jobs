import { MAILER_OPTIONS, MAILER_TRANSPORT_CONFIG } from "../../config/mailer.js";
import { Logger } from "../../helpers/logger.js";
import { EmailService } from "../../helpers/mailer.js";
import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { BackgroundJob } from "../../lib/queue/job.js";
import { AccountNotificationInput } from "../services/dto/user-account-notification.js";
import { RecoveryAccount } from "../services/recovery-account.service.js";

export class RecoveryAccountJob extends BackgroundJob {
    constructor(queueProvider) {
        super(queueProvider, "recovery-account", {
            prefetch: 1,
        })
    }

    async work(job) {
        try {
            console.log(`Sent email to ${job}!`);

            await new RecoveryAccount(
                new EmailService(MAILER_OPTIONS, MAILER_TRANSPORT_CONFIG),
                new HtmlTemplateEngineAdapter()
            ).execute(new AccountNotificationInput(job))

        } catch (error) {
            Logger.error({
                msg: "Falha ao enviar email.",
                obj: error.message,
            });

            throw error
        }
    }
}