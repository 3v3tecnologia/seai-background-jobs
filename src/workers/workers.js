import {
  FetchFuncemeEquipmentsWorker,
  FetchFuncemeMeasurementsWorker,
  SendNewsletterWorker,
  SendUserAccountNotificationWorker,
} from "./handlers/index.js";
import { IrrigationMailerScheduler } from "./handlers/irrigation/irrigation_mailer_scheduler.js";
import { QUEUES } from "./queues.js";

export default [
  {
    queue_name: QUEUES.FETCH_EQUIPMENTS,
    workers: [
      {
        name: FetchFuncemeEquipmentsWorker.worker_name,
        process: (command) => FetchFuncemeEquipmentsWorker.handler(command),
      },
    ],
  },
  {
    queue_name: QUEUES.FETCH_MEASUREMENTS,
    workers: [
      {
        name: FetchFuncemeMeasurementsWorker.worker_name,
        process: (command) => FetchFuncemeMeasurementsWorker.handler(command),
      },
    ],
  },
  {
    queue_name: QUEUES.NEWSLETTER,
    workers: [
      {
        name: SendNewsletterWorker.worker_name,
        process: (command) => SendNewsletterWorker.handler(command),
      },
    ],
  },
  {
    queue_name: QUEUES.USER_ACCOUNT_NOTIFICATION,
    workers: [
      {
        name: SendUserAccountNotificationWorker.worker_name,
        process: (command) =>
          SendUserAccountNotificationWorker.handler(command),
      },
    ],
  },
  {
    queue_name: QUEUES.IRRIGATION_REPORTS,
    workers: [
      {
        name: IrrigationMailerScheduler.worker_name,
        process: (command) => IrrigationMailerScheduler.handler(command),
      },
    ],
  },
  {
    queue_name: QUEUES.IRRIGATION_REPORTS_SCHEDULER,
    workers: [
      {
        name: IrrigationMailerScheduler.worker_name,
        process: (command) => IrrigationMailerScheduler.handler(command),
      },
    ],
  },
];
