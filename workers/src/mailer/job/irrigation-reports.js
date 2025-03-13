import { EmailService } from "../../helpers/mailer.js";
import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { Logger } from "../../helpers/logger.js";
import { BackgroundJob } from "../../infra/queue/job.js";
import { MAILER_OPTIONS, MAILER_TRANSPORT_CONFIG } from "../../config/mailer.js";
import { SendUserIrrigationMail } from "../services/send-user-irrigation-mail.service.js";
import { IrrigationReportsNotificationInput } from "../services/dto/user-irrigation.js";

export class IrrigationReportsJob extends BackgroundJob {

    constructor(queueProvider) {
        super(queueProvider, "irrigation-suggestion", {
            prefetch: 1,
        }
        )
    }

    async work(job) {
        try {
            console.log(` Sent email to ${job}!`);

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