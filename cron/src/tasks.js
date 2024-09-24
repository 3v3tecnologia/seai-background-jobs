import { fetchEquipmentsService } from "./equipments/services/factories/fetch-equipments.service.js";
import { fetchEquipmentsMeasurementsService } from "./equipments/services/factories/fetch-measurements.service.js";
import { sendNewsletterEmailService } from "./mailer/services/factories/send-newsletter.js";
import { sendUserIrrigationMailService } from "./mailer/services/factories/send-user-irrigation-mail.js";

export const CRON_JOBS = [
    {
        cron: "* * * * *",
        handler: () => fetchEquipmentsService.execute()
    },
    {
        cron: "0 */8 * * *",
        handler: () => fetchEquipmentsMeasurementsService.execute()
    },
    {
        cron: "0 7 * * *",
        handler: () => sendUserIrrigationMailService.execute()
    },
    {
        cron: "0 14 * * *",
        handler: () => sendNewsletterEmailService.execute()
    },
]