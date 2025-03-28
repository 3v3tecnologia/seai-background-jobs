import "dotenv/config.js";

import { Logger } from "./helpers/logger.js";
import { WorkersManager } from "./infra/queue/job-manager.js";
import { PgBossAdapter } from "./infra/queue/pg-boss/pb-boss.js";
import { QueueProvider } from "./infra/queue/queue-provider.js";
import { ASYNC_JOB_URL } from "./infra/queue/pg-boss/connection.js";
import { CreateAccountJob } from "./mailer/job/create-account.js";
import { IrrigationReportsJob } from "./mailer/job/irrigation-reports.js";
import { NewsletterJob } from "./mailer/job/newsletter.js";
import { RecoveryAccountJob } from "./mailer/job/recovery-account.js";


const queueProvider = new QueueProvider(new PgBossAdapter(ASYNC_JOB_URL))

const workerManager = new WorkersManager(queueProvider)

const workers = [RecoveryAccountJob, CreateAccountJob, IrrigationReportsJob, NewsletterJob]

try {

    for (const worker of workers) {
        workerManager.set(worker)
    }

    // Keep the process alive to receive messages
    process.on('SIGINT', async () => {
        await workerManager.stopMonitoring()
        process.exit(0);
    });

    await workerManager.startMonitoring()

} catch (error) {
    console.error('Error:', error);
}

process.on("uncaughtException", (error) => {
    Logger.error({
        obj: error,
        msg: `Erro na execução no monitoramento de workers.`,
    });
    process.exit(1);
});