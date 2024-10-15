import { EmailService } from "../../helpers/mailer.js";
import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { Logger } from "../../helpers/logger.js";
import { BackgroundJob } from "../../lib/queue/job.js";
import { AccountCreation } from "../services/create-account.service.js";
import { AccountNotificationInput } from "../services/dto/user-account-notification.js";
import { MAILER_OPTIONS, MAILER_TRANSPORT_CONFIG } from "../../config/mailer.js";
export class CreateAccountJob extends BackgroundJob {
    type = "create-account";

    constructor(queueProvider) {
        super(queueProvider)
    }

    async work(job) {
        try {
            console.log(`[${this.type}] Sent email to ${job}!`);

            await new AccountCreation(
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