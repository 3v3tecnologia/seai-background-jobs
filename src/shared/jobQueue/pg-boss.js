import { Logger } from "../../../../shared/logger.js";
import { pgBossConnection } from "./connection.js";

export class PgBossAdapter {
  #boss;

  static instance = null;

  constructor() {
    this.#boss = pgBossConnection;

    Object.freeze(this);
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

  static getInstance() {
    if (PgBossAdapter.instance == null) {
      Logger.info({
        msg: "[⚙️] Criando conexão com o banco de dados de jobs",
      });

      pgBossConnection.on("error", (error) => {
        Logger.error({
          msg: `Falha ao realizar conexão com o banco de dados de JOBS`,
          obj: error,
        });

        throw error;
      });

      Logger.info({
        msg: "[✅] Conexão iniciada com sucesso",
      });

      PgBossAdapter.instance = new PgBossAdapter(connection);
    }

    return PgBossAdapter.instance;
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

  async registerWorker(queue, worker) {
    Logger.info({
      msg: `[⚙️] Registrando worker ${worker.name} para a fila ${queue}`,
    });
    await this.#boss.work(
      queue,
      {
        batchSize: 1,
        includeMetadata: true,
      },
      worker
    );
  }
}

export const pgBoss = new PgBossAdapter();
