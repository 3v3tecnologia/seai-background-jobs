import { sendNewsletterEmailService } from "../../modules/mailer/services/factories/send-newsletter.js"

(async function () {
    try {
        await sendNewsletterEmailService.execute()

        process.exit(0)
    } catch (error) {
        Logger.error({
            msg: "Falha ao enviar notícias",
            obj: error.message,
        });

        process.exit(1)
    }
})()
