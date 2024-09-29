import { Logger } from "../../lib/logger.js";
import { BackgroundJob } from "../../lib/queue/job.js";
import { HtmlTemplateEngineAdapter } from "../infra/html-template-engine.js";
import { EmailService } from "../infra/mailer.js";
import { AccountNotificationInput } from "../services/dto/user-account-notification.js";
import { RecoveryAccount } from "../services/recovery-account.service.js";

export class RecoveryAccountJob extends BackgroundJob {
    type = "recovery-account";

    constructor(queueProvider) {
        super(queueProvider)
    }

    async work(job) {
        try {
            console.log(`[${this.type}] Sent email to ${job}!`);

            await new RecoveryAccount(
                new EmailService(),
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