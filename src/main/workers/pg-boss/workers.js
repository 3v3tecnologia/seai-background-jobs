import {
  IrrigationMailerScheduler,
  SendNewsletter,
  SendUserAccountNotification,
  SendUserIrrigationMail,
} from "../../../modules/mailer/handler/index.js";

import {
  FetchEquipments,
  FetchEquipmentsMeasurements,
} from "../../../modules/equipments/handler/index.js";

import {
  fetchEquipment,
  fetchEquipmentMeasurements,
} from "../../../modules/equipments/handler/factories/index.js";

import {
  irrigationMailerScheduler,
  sendNewsletter,
  sendUserAccountNotification,
  sendUserIrrigationMail,
} from "../../../modules/mailer/jobs/factories/index.js";
import { QUEUES } from "../../config/queues.js";

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
