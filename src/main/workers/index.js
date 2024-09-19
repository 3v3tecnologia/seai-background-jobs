import "dotenv/config.js";

import workers from "./workers.js";

import { cronJobs } from "./cron.js";
import { pgBoss } from "./lib/pg-boss.js";
import { Logger } from "../../shared/logger.js";

await pgBoss.startQueueMonitoring();

Logger.info({
    msg: "Registrando cron jobs",
});

for (const job of cronJobs) {
    const { cron, data, options, queue } = job;
    await pgBoss.schedule(queue, cron, data, options);
}

Logger.info({ msg: "[⚡] Iniciando workers..." });

for (const task of workers) {
    await pgBoss.registerWorker(task.queue_name, task.worker);
}

Logger.info({
    msg: "[😉] Sucesso ao iniciar os workers...",
});

process.on("uncaughtException", (error) => {
    Logger.error({
        obj: error,
        msg: `Erro na execução no monitoramento de workers.`,
    });
    process.exit(1);
});
