import { fetchEquipment } from "../modules/equipments/handler/factories/fetch-equipments.js";
import { fetchEquipmentMeasurements } from "../modules/equipments/handler/factories/fetch-measurements.js";
import {
  FetchEquipments,
  FetchEquipmentsMeasurements,
} from "../modules/equipments/handler/index.js";
import { irrigationMailerScheduler } from "../modules/mailer/handler/factories/irrigation_mailer_scheduler.js";
import { sendNewsletter } from "../modules/mailer/handler/factories/send-newsletter.js";
import { sendUserAccountNotification } from "../modules/mailer/handler/factories/send-user-account-notification.js";
import { sendUserIrrigationMail } from "../modules/mailer/handler/factories/send-user-irrigation-mail.js";

import {
  IrrigationMailerScheduler,
  SendNewsletter,
  SendUserAccountNotification,
  SendUserIrrigationMail,
} from "../modules/mailer/handler/index.js";

import { QUEUES } from "./config/queues.js";

export default [
  {
    queue_name: QUEUES.FETCH_EQUIPMENTS,
    workers: [
      {
        name: FetchEquipments.worker_name,
        handle: (command) => fetchEquipment.handle(command),
      },
    ],
  },
  {
    queue_name: QUEUES.FETCH_MEASUREMENTS,
    workers: [
      {
        name: FetchEquipmentsMeasurements.worker_name,
        handle: (command) => fetchEquipmentMeasurements.handle(command),
      },
    ],
  },
  {
    queue_name: QUEUES.NEWSLETTER,
    workers: [
      {
        name: SendNewsletter.worker_name,
        handle: (command) => sendNewsletter.handle(command),
      },
    ],
  },
  {
    queue_name: QUEUES.USER_ACCOUNT_NOTIFICATION,
    workers: [
      {
        name: SendUserAccountNotification.worker_name,
        handle: (command) => sendUserAccountNotification.handle(command),
      },
    ],
  },
  {
    queue_name: QUEUES.IRRIGATION_REPORTS,
    workers: [
      {
        name: SendUserIrrigationMail.worker_name,
        handle: (command) => sendUserIrrigationMail.handle(command),
      },
    ],
  },
  {
    queue_name: QUEUES.IRRIGATION_REPORTS_SCHEDULER,
    workers: [
      {
        name: IrrigationMailerScheduler.worker_name,
        handle: (command) => irrigationMailerScheduler.handle(command),
      },
    ],
  },
];
