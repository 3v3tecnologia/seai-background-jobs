import { EmailService } from "../../helpers/mailer.js";
import { HtmlTemplateEngineAdapter } from "../../infra/html-template-engine.js";
import { Logger } from "../../helpers/logger.js";
import { BackgroundJob } from "../../lib/queue/job.js";
import { MAILER_OPTIONS, MAILER_TRANSPORT_CONFIG } from "../../config/mailer.js";
import { SendNewsletterEmail } from "../services/send-newsletter.service.js";
import { SendNewsletterInput } from "../services/dto/newsletter.js";
import { NewsletterApi } from "../../infra/newsletter.service.js";

export class NewsletterJob extends BackgroundJob {
    type = "newsletter";

    constructor(queueProvider) {
        super(queueProvider)
    }

    async work(job) {
        try {
            console.log(`[${this.type}] Sent email to ${job}!`);

            await new SendNewsletterEmail(
                new NewsletterApi(),
                new EmailService(MAILER_OPTIONS, MAILER_TRANSPORT_CONFIG),
                new HtmlTemplateEngineAdapter(),

            ).execute(new SendNewsletterInput(job))

        } catch (error) {
            Logger.error({
                msg: "Falha ao enviar email.",
                obj: error.message,
            });

            throw error
        }
    }
}