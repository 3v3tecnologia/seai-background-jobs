(async function () {
    const { config } = await import("dotenv")
    config({
        path: '/usr/src/app/.env'
    })
    const { sendUserIrrigationMailService } = await import("../mailer/services/factories/send-user-irrigation-mail.js");

    await sendUserIrrigationMailService.execute()
})()