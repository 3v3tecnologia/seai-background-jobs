import "dotenv/config.js";

import { Logger } from "./helpers/logger.js";
import { WorkersManager } from "./lib/queue/job-manager.js";
import { QueueProvider } from "./lib/queue/queue-provider.js";
import { RabbitMqAdapter } from "./lib/queue/rabbitmq/rabbitmq.js";
import { CreateAccountJob } from "./mailer/job/create-account.js";
import { RecoveryAccountJob } from "./mailer/job/recovery-account.js";
import { RABBIT_MQ_URL } from "./lib/queue/rabbitmq/connection.js";
import { IrrigationReportsJob } from "./mailer/job/irrigation-reports.js";
import { NewsletterJob } from "./mailer/job/newsletter.js";


const queueProvider = new QueueProvider(new RabbitMqAdapter(RABBIT_MQ_URL))

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