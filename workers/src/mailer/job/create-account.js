import { Logger } from "../../lib/logger.js";
import { BackgroundJob } from "../../lib/queue/job.js";
import { HtmlTemplateEngineAdapter } from "../infra/html-template-engine.js";
import { EmailService } from "../infra/mailer.js";
import { AccountCreation } from "../services/create-account.service.js";
import { AccountNotificationInput } from "../services/dto/user-account-notification.js";

export class CreateAccountJob extends BackgroundJob {
    type = "create-account";

    constructor(queueProvider) {
        super(queueProvider)
    }

    async work(job) {
        try {
            console.log(`[${this.type}] Sent email to ${job}!`);

            await new AccountCreation(
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