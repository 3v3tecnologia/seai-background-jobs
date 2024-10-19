(async function () {
    const { config } = await import("dotenv")
    config({
        path: '/usr/src/app/.env'
    })
    try {
        const { sendNewsletterEmailService } = await import("../mailer/services/factories/send-newsletter.js");

        await sendNewsletterEmailService.execute()
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
})()