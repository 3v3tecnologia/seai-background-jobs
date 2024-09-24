import "dotenv/config.js";

import workers from "./workers.js";

import { pgBoss } from "./lib/pg-boss.js";
import { Logger } from "./lib/logger.js";

await pgBoss.startQueueMonitoring();

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