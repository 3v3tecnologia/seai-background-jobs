import "dotenv/config.js";

import { Logger } from "./lib/logger.js";
import { WorkersManager } from "./lib/queue/job-manager.js";
import { PgBossAdapter } from "./lib/queue/pg-boss/pg-boss.js";
import { QueueProvider } from "./lib/queue/queue-provider.js";
import { RecoveryAccountJob } from "./mailer/job/recovery-account.js";
import { CreateAccountJob } from "./mailer/job/create-account.js";


const queueProvider = new QueueProvider(new PgBossAdapter())

const workerManager = new WorkersManager(queueProvider)

const workers = [RecoveryAccountJob, CreateAccountJob]

try {

    for (const worker of workers) {
        workerManager.set(worker)
    }


    // Keep the process alive to receive messages
    process.on('SIGINT', async () => {
        await workerManager.stopMonitoring()
        process.exit(0);
    });

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