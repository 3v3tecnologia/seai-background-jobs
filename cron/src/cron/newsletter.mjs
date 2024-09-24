(async function () {
    const { config } = await import("dotenv")
    config({
        path: '/usr/src/app/.env'
    })
    const { sendNewsletterEmailService } = await import("../mailer/services/factories/send-newsletter.js");

    await sendNewsletterEmailService.execute()
})()