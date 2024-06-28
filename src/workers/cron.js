import { QUEUES } from "./queues.js";

export const cronJobs = [
  {
    queue: QUEUES.FETCH_EQUIPMENTS,
    cron: "0 0 * * *",
    data: null,
    options: {
      tz: "America/Fortaleza",
      retryLimit: 3,
      retryDelay: 60,
      priority: 1,
    },
  },
  {
    queue: QUEUES.FETCH_MEASUREMENTS,
    cron: "0 1 * * *",
    data: null,
    options: {
      tz: "America/Fortaleza",
      retryLimit: 3,
      retryDelay: 60,
      priority: 2,
    },
  },
  {
    queue: QUEUES.IRRIGATION_REPORTS,
    cron: "0 4 * * *",
    data: null,
    options: {
      tz: "America/Fortaleza",
      retryLimit: 3,
      retryDelay: 60,
      priority: 2,
    },
  },
];
