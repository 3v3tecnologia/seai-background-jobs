import { EmailService } from "../../helpers/mailer.js";
import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { Logger } from "../../helpers/logger.js";
import { BackgroundJob } from "../../lib/queue/job.js";
import { MAILER_OPTIONS, MAILER_TRANSPORT_CONFIG } from "../../config/mailer.js";
import { SendUserIrrigationMail } from "../services/send-user-irrigation-mail.service.js";
import { IrrigationReportsNotificationInput } from "../services/dto/user-irrigation.js";

export class IrrigationReportsJob extends BackgroundJob {
    type = "irrigation-reports";

    constructor(queueProvider) {
        super(queueProvider)
    }

    async work(job) {
        try {
            console.log(`[${this.type}] Sent email to ${job}!`);

            await new SendUserIrrigationMail(
                new EmailService(MAILER_OPTIONS, MAILER_TRANSPORT_CONFIG),
                new HtmlTemplateEngineAdapter()
            ).execute(new IrrigationReportsNotificationInput(job))

        } catch (error) {
            Logger.error({
                msg: "Falha ao enviar email.",
                obj: error.message,
            });

            throw error
        }
    }
}