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
        cron: "0 */8 * * *",
        data: null,
        options: {
            tz: "America/Fortaleza",
            retryLimit: 3,
            retryDelay: 120,
            priority: 2,
        },
    },
    {
        queue: QUEUES.IRRIGATION_REPORTS,
        cron: "0 7 * * *",
        data: null,
        options: {
            tz: "America/Fortaleza",
            retryLimit: 3,
            retryDelay: 60,
            priority: 2,
        },
    },
    {
        queue: QUEUES.NEWSLETTER,
        cron: "0 14 * * *",
        data: null,
        options: {
            tz: "America/Fortaleza",
            retryLimit: 3,
            retryDelay: 60,
            priority: 2,
        },
    },
];
