(async function () {
    const { config } = await import("dotenv")
    config({
        path: '/usr/src/app/.env'
    })
    try {
        const { sendUserIrrigationMailService } = await import("../mailer/services/factories/send-user-irrigation-mail.js");

        await sendUserIrrigationMailService.execute()
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
})()