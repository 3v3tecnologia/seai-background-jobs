import { pgBossWorker } from "./protocol/worker.js";

import { accountNotificationService, sendNewsletterEmailService, sendUserIrrigationMailService } from '../../modules/mailer/services/factories/index.js'
import { fetchEquipmentsMeasurementsService, fetchEquipmentsService } from '../../modules/equipments/services/factories/index.js'

import { AccountNotificationInput } from '../../modules/mailer/services/dto/send-user-account-notification.js'
import { QUEUES } from "./queues.js";

export default [
  {
    queue_name: QUEUES.FETCH_EQUIPMENTS,
    worker: (command) => pgBossWorker(fetchEquipmentsService)(),
    options: {
      batchSize: 1,
      includeMetadata: true,
    }
  },
  {
    queue_name: QUEUES.FETCH_MEASUREMENTS,
    worker: (command) => pgBossWorker(fetchEquipmentsMeasurementsService)(),
  },
  {
    queue_name: QUEUES.NEWSLETTER,
    worker: (command) => pgBossWorker(sendNewsletterEmailService)(),
  },
  {
    queue_name: QUEUES.USER_ACCOUNT_NOTIFICATION,
    // Destruct from pg-boss job payload object
    worker: (command) => pgBossWorker(accountNotificationService)(new AccountNotificationInput(command[0].data)),
  },
  {
    queue_name: QUEUES.IRRIGATION_REPORTS,
    worker: (command) => pgBossWorker(sendUserIrrigationMailService)(command),
  },
];
