import "dotenv/config.js";
import cron from 'node-cron';
import { CRON_JOBS } from "./tasks.js";

CRON_JOBS.forEach(job => {
    cron.schedule(job.cron, async () => {
        try {
            console.log('Cron job started');
            await job.handler()
        } catch (error) {
            console.log('Cron job finished');
        }
    });
})