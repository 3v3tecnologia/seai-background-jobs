import { pgBossConnection } from "./connection.js";
import { Logger } from "./logger.js"

export class PgBossAdapter {
  #boss;

  static instance = null;

  constructor() {
    this.#boss = pgBossConnection;

    Object.freeze(this);
  }

  async nack(queue) {
    throw new Error("Not implemented");
  }

  async startQueueMonitoring() {
    Logger.info({
      msg: "[🔍] Iniciando monitoramento de jobs",
    });
    // Prepares the target database and begins job monitoring.
    await this.#boss.start();

    Logger.info({
      msg: "[✅] Monitoramento iniciado com sucesso",
    });
  }

  async schedule(name_queue, cron, data, options) {
    await this.#boss.schedule(name_queue, cron, data, options);
    Logger.info({
      msg: `[✅] CronJob agendado com sucesso para a fila ${name_queue}`,
    });
  }

  async fetch(name_queue, qtd) {
    return await this.#boss.fetch(name_queue, qtd);
  }

  async enqueue(name_queue, data, options) {
    return await this.#boss.send(name_queue, data, options);
  }

  async registerWorker(queue, worker, config = {
    batchSize: 1,
    includeMetadata: true,
  }) {
    Logger.info({
      msg: `[⚙️] Registrando worker ${worker.name} para a fila ${queue}`,
    });
    await this.#boss.work(
      queue,
      config,
      worker
    );
  }
}

export const pgBoss = new PgBossAdapter();
