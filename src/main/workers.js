import {
  FetchEquipments,
  FetchEquipmentsMeasurements,
} from "../modules/equipments/handler/index.js";

import {
  IrrigationMailerScheduler,
  SendNewsletter,
  SendUserAccountNotification,
  SendUserIrrigationMail,
} from "../modules/mailer/handler/index.js";

import { QUEUES } from "./queues.js";

export default [
  {
    queue_name: QUEUES.FETCH_EQUIPMENTS,
    workers: [
      {
        name: FetchEquipments.worker_name,
        handle: (command) => FetchEquipments.handler(command),
      },
    ],
  },
  {
    queue_name: QUEUES.FETCH_MEASUREMENTS,
    workers: [
      {
        name: FetchEquipmentsMeasurements.worker_name,
        handle: (command) => FetchEquipmentsMeasurements.handler(command),
      },
    ],
  },
  {
    queue_name: QUEUES.NEWSLETTER,
    workers: [
      {
        name: SendNewsletter.worker_name,
        handle: (command) => SendNewsletter.handler(command),
      },
    ],
  },
  {
    queue_name: QUEUES.USER_ACCOUNT_NOTIFICATION,
    workers: [
      {
        name: SendUserAccountNotification.worker_name,
        handle: (command) => SendUserAccountNotification.handler(command),
      },
    ],
  },
  {
    queue_name: QUEUES.IRRIGATION_REPORTS,
    workers: [
      {
        name: SendUserIrrigationMail.worker_name,
        handle: (command) => SendUserIrrigationMail.handler(command),
      },
    ],
  },
  {
    queue_name: QUEUES.IRRIGATION_REPORTS_SCHEDULER,
    workers: [
      {
        name: IrrigationMailerScheduler.worker_name,
        handle: (command) => IrrigationMailerScheduler.handler(command),
      },
    ],
  },
];
